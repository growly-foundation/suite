import { DynamicStructuredTool } from '@langchain/core/tools';
import { ConfigService } from '@nestjs/config';
import { isAddress } from 'viem';
import { z } from 'zod';
import axios from 'axios';
import { ZerionFungiblePositionsResponse } from '../../zerion/types';
import { ZERION_V1_BASE_URL } from '../../zerion/constants';
import { getEncodedKey } from '../../zerion/zerion';
import { TokenInfo, RebalanceRecommendation, RebalancingStrategy } from './types';
import { TokenListManager } from './token-list';
import { createSwapRecommendation, updateSwapWithTokenAddresses } from './swap-utils';

export function makeRebalancePortfolioTool(configService: ConfigService) {
  const encodedKey = getEncodedKey(configService);
  const axiosInstance = axios.create({
    baseURL: ZERION_V1_BASE_URL,
    headers: {
      Accept: 'application/json',
      Authorization: `Basic ${encodedKey}`,
    },
  });

  // Create token list manager
  const tokenListManager = new TokenListManager();

  function generateRebalanceRecommendation(
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
      case 'conservative': {
        // Conservative strategy: Reduce high volatility tokens and increase stablecoins
        const totalValue = tokens.reduce((sum, token) => sum + token.value, 0);
        const stablecoins = sortedTokens.filter(
          t =>
            t.symbol === 'USDC' || t.symbol === 'USDT' || t.symbol === 'DAI' || t.symbol === 'BUSD'
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

      case 'aggressive': {
        // Aggressive strategy: Increase exposure to high potential growth tokens
        const stablecoins = sortedTokens.filter(
          t =>
            t.symbol === 'USDC' || t.symbol === 'USDT' || t.symbol === 'DAI' || t.symbol === 'BUSD'
        );

        const highGrowthTokens = sortedTokens.filter(
          t => !stablecoins.includes(t) && t.type !== 'staked'
        );

        if (
          stablecoins.length > 0 &&
          highGrowthTokens.length > 0 &&
          stablecoins[0].percentage > 30
        ) {
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

      case 'moderate':
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

  return new DynamicStructuredTool({
    name: 'rebalance_portfolio_suggestion',
    description: `
Analyzes a user's crypto portfolio and suggests how to rebalance it for better risk management or performance.
Returns a detailed recommendation with a pre-filled Uniswap swap link.

Triggers when users ask for portfolio rebalancing suggestions, diversification advice, or want help optimizing their holdings.

Input:
- walletAddress: Wallet address to analyze (required)
- strategy: Rebalancing strategy ("conservative", "moderate", or "aggressive")

Output:
- A rebalancing recommendation with reasoning and a pre-filled Uniswap link.
`,
    schema: z
      .object({
        walletAddress: z
          .string()
          .describe('The wallet address to analyze for rebalancing recommendations'),
        strategy: z
          .enum(['conservative', 'moderate', 'aggressive'] as const)
          .describe('The rebalancing strategy preference')
          .default('moderate'),
      })
      .describe('Input schema for portfolio rebalance suggestions'),
    func: async ({ walletAddress, strategy }) => {
      if (!isAddress(walletAddress)) {
        return `Invalid wallet address: ${walletAddress}`;
      }

      try {
        // Fetch the user's portfolio positions using Zerion
        const response = await axiosInstance.get<ZerionFungiblePositionsResponse>(
          `/wallets/${walletAddress}/positions?filter[positions]=no_filter&currency=usd&filter[trash]=only_non_trash&sort=value`
        );

        const { data } = response.data;

        // Process the portfolio data
        const tokens: TokenInfo[] = data
          .filter(pos => pos.attributes.value !== null && pos.attributes.value > 1)
          .map(pos => {
            const { value, position_type, fungible_info, price, quantity } = pos.attributes;
            const chain = pos.relationships.chain.data.id;

            // Try to get the token address from implementations if available
            let address: string | null = null;
            if (
              fungible_info.implementations &&
              fungible_info.implementations.length > 0 &&
              fungible_info.implementations[0].address
            ) {
              address = fungible_info.implementations[0].address;
            }

            return {
              symbol: fungible_info.symbol,
              name: fungible_info.name,
              chain,
              address,
              value: value || 0,
              percentage: 0, // Will calculate after summing total
              type: position_type,
              price: price || 0,
              quantity: quantity?.float || 0,
            };
          });

        // Calculate total value and percentages
        const totalValue = tokens.reduce((sum, token) => sum + token.value, 0);
        tokens.forEach(token => {
          token.percentage = (token.value / totalValue) * 100;
        });

        // Generate rebalance recommendation based on the strategy
        const recommendation = generateRebalanceRecommendation(tokens, strategy);

        if (!recommendation) {
          return 'Your portfolio appears well-balanced based on your selected strategy. No specific rebalancing recommendations at this time.';
        }

        // Update the recommendation with token addresses from token lists
        const updatedRecommendation = await updateSwapWithTokenAddresses(
          recommendation,
          tokenListManager
        );

        // Format the response with additional portfolio context
        const { fromToken, toToken, reason, uniswapLink, valueToSwap, tokenAmount } =
          updatedRecommendation;

        return `
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
`;
      } catch (error) {
        if (error instanceof Error) {
          return `Failed to generate rebalance suggestions: ${error.message}`;
        }
        return 'Failed to generate rebalance suggestions.';
      }
    },
  });
}
