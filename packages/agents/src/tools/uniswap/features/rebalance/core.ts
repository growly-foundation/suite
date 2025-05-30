import { isAddress } from 'viem';

import { TokenListManager } from '../../../../config/token-list';
import { ToolFn, ToolOutputValue } from '../../../../utils/tools';
import { getZerionAxiosInstance } from '../../../zerion/rpc';
import { ZerionFungiblePositionsResponse } from '../../../zerion/types';
import { processFungiblePositions } from '../../../zerion/utils';
import { createSwapRecommendation, updateSwapWithTokenAddresses } from '../../swap-utils';
import { RebalanceRecommendation, RebalancingStrategy, TokenInfo } from '../../types';

export function generateRebalanceRecommendation(
  tokens: TokenInfo[],
  strategy: RebalancingStrategy
): RebalanceRecommendation | null {
  // Sort tokens by value (descending)
  const sortedTokens = [...tokens].sort((a, b) => b.value - a.value);

  if (sortedTokens.length < 2) {
    return null; // Not enough tokens to make a recommendation
  }

  // Different strategies have different rebalancing rules
  switch (strategy) {
    case RebalancingStrategy.CONSERVATIVE: {
      // Conservative strategy: Reduce high volatility tokens and increase stablecoins
      const totalValue = tokens.reduce((sum, token) => sum + token.value, 0);
      const stablecoins = sortedTokens.filter(
        t => t.symbol === 'USDC' || t.symbol === 'USDT' || t.symbol === 'DAI' || t.symbol === 'BUSD'
      );

      const highVolatilityTokens = sortedTokens.filter(
        t => !stablecoins.includes(t) && t.value > totalValue * 0.25
      );

      if (highVolatilityTokens.length > 0 && stablecoins.length > 0) {
        const fromToken = highVolatilityTokens[0];
        const toToken = stablecoins[0];
        // Swap 30% of the high volatility token value
        const valueToSwap = fromToken.value * 0.3;

        return createSwapRecommendation(
          fromToken,
          toToken,
          'Reducing exposure to high volatility assets to preserve capital',
          valueToSwap
        );
      }
      break;
    }

    case RebalancingStrategy.AGGRESSIVE: {
      // Aggressive strategy: Increase exposure to high potential growth tokens
      const stablecoins = sortedTokens.filter(
        t => t.symbol === 'USDC' || t.symbol === 'USDT' || t.symbol === 'DAI' || t.symbol === 'BUSD'
      );

      const highGrowthTokens = sortedTokens.filter(
        t => !stablecoins.includes(t) && t.type !== 'staked'
      );

      if (stablecoins.length > 0 && highGrowthTokens.length > 0 && stablecoins[0].percentage > 30) {
        const fromToken = stablecoins[0];
        const toToken = highGrowthTokens[0];
        // Swap 40% of the stablecoin value
        const valueToSwap = fromToken.value * 0.4;

        return createSwapRecommendation(
          fromToken,
          toToken,
          'Increasing exposure to growth assets for higher potential returns',
          valueToSwap
        );
      }
      break;
    }

    case RebalancingStrategy.MODERATE:
    default: {
      // Moderate strategy: Balance the portfolio by reducing over-concentrated positions
      const largestToken = sortedTokens[0];

      // If the largest token is over 40% of the portfolio, recommend diversifying
      if (largestToken.percentage > 40) {
        // Find a token to diversify into
        const otherTokens = sortedTokens.filter(
          t =>
            t.symbol !== largestToken.symbol &&
            t.type !== 'staked' &&
            t.chain === largestToken.chain
        );

        if (otherTokens.length > 0) {
          const toToken = otherTokens[0];
          // Swap 25% of the largest token value
          const valueToSwap = largestToken.value * 0.25;

          return createSwapRecommendation(
            largestToken,
            toToken,
            'Diversifying from an over-concentrated position to reduce risk',
            valueToSwap
          );
        }
      }
      break;
    }
  }

  return null; // No recommendation for the given strategy
}

export const analyzeAndSuggestRebalance: ToolFn =
  () =>
  async ({
    walletAddress,
    strategy,
  }: {
    walletAddress: string;
    strategy: RebalancingStrategy;
  }): Promise<ToolOutputValue[]> => {
    if (!isAddress(walletAddress)) {
      return [
        {
          type: 'system:error',
          content: `Invalid wallet address: ${walletAddress}`,
        },
      ];
    }
    try {
      // Fetch the user's portfolio positions using Zerion
      const response = await getZerionAxiosInstance().get<ZerionFungiblePositionsResponse>(
        `/wallets/${walletAddress}/positions?filter[positions]=no_filter&currency=usd&filter[trash]=only_non_trash&sort=value`
      );
      const { data } = response.data;
      // Process the portfolio data
      const tokens: TokenInfo[] = processFungiblePositions(data);
      // Calculate total value and percentages
      const totalValue = tokens.reduce((sum, token) => sum + token.value, 0);
      tokens.forEach(token => {
        token.percentage = (token.value / totalValue) * 100;
      });
      // Generate rebalance recommendation based on the strategy
      const recommendation = generateRebalanceRecommendation(tokens, strategy);
      if (!recommendation) {
        return [
          {
            type: 'text',
            content:
              'Your portfolio appears well-balanced based on your selected strategy. No specific rebalancing recommendations at this time.',
          },
        ];
      }
      // Update the recommendation with token addresses from token lists
      const updatedRecommendation = await updateSwapWithTokenAddresses(
        recommendation,
        new TokenListManager()
      );
      // Format the response with additional portfolio context
      const { fromToken, toToken, reason, uniswapLink, valueToSwap, tokenAmount } =
        updatedRecommendation;
      return [
        {
          type: 'text',
          content: `
## Portfolio Rebalance Recommendation

I suggest swapping **${tokenAmount ? tokenAmount.toFixed(6) : '?'} ${fromToken.symbol}** (about $${valueToSwap.toFixed(2)}) to **${toToken.symbol}**.

### Why make this swap?
${reason}

### Current allocation:
- ${fromToken.symbol}: $${fromToken.value.toFixed(2)} (${fromToken.percentage.toFixed(2)}% of portfolio)
- ${toToken.symbol}: $${toToken.value.toFixed(2)} (${toToken.percentage.toFixed(2)}% of portfolio)

### After rebalancing (estimated):
- ${fromToken.symbol}: $${(fromToken.value - valueToSwap).toFixed(2)}
- ${toToken.symbol}: $${(toToken.value + valueToSwap).toFixed(2)}

You can execute this swap on Uniswap:
@${uniswapLink}
`,
        },
        {
          type: 'uniswap:swap',
          content: {
            fromToken,
            toToken,
            link: uniswapLink,
          },
        },
      ];
    } catch (error: any) {
      return [
        {
          type: 'system:error',
          content: `Failed to generate rebalance suggestions: ${error.message}`,
        },
      ];
    }
  };
