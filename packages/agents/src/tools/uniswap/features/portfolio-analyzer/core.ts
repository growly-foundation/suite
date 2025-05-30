import { isAddress } from 'viem';

import { ToolFn, ToolOutputValue } from '../../../../utils/tools';
import { getZerionAxiosInstance } from '../../../zerion/rpc';
import { ZerionFungiblePositionsResponse } from '../../../zerion/types';
import { processFungiblePositions } from '../../../zerion/utils';
import { TokenInfo } from '../../types';
import { PortfolioAnalysis, RebalancingStrategy } from '../../types';

function analyzePortfolio(tokens: TokenInfo[], strategy: RebalancingStrategy): PortfolioAnalysis {
  // Sort tokens by value (descending)
  const sortedTokens = [...tokens].sort((a, b) => b.value - a.value);

  // Calculate total portfolio value
  const totalValue = tokens.reduce((sum, token) => sum + token.value, 0);

  // Get asset categories
  const stablecoins = tokens.filter(
    t => t.symbol === 'USDC' || t.symbol === 'USDT' || t.symbol === 'DAI' || t.symbol === 'BUSD'
  );
  const stablecoinPercentage = stablecoins.reduce((sum, token) => sum + token.percentage, 0);

  const largestToken = sortedTokens[0];
  const largestTokenPercentage = largestToken ? largestToken.percentage : 0;

  // Risk analysis
  const riskLevel = calculateRiskLevel(tokens);

  // Chain diversification
  const chains = [...(new Set(tokens.map(t => t.chain)) as any)];
  const chainCounts = chains.length;

  // Token type diversification
  const tokenTypes = [...(new Set(tokens.map(t => t.type)) as any)];
  const tokenTypeCounts = tokenTypes.length;

  // Determine rebalance suggestions
  let fromToken: TokenInfo | null = null;
  let toToken: TokenInfo | null = null;
  let swapAmountPercentage = 0;
  let swapAmount = 0;
  let detailedReason = '';

  switch (strategy) {
    case 'conservative': {
      // Conservative strategy aims for more stablecoins and less volatility
      const highVolatilityThreshold = 0.25; // 25% of portfolio
      const highVolatilityTokens = sortedTokens.filter(
        t => !stablecoins.includes(t) && t.value > totalValue * highVolatilityThreshold
      );

      if (highVolatilityTokens.length > 0 && stablecoins.length > 0) {
        fromToken = highVolatilityTokens[0];
        toToken = stablecoins[0];
        swapAmountPercentage = 0.3; // 30% of the token value
        swapAmount = fromToken.value * swapAmountPercentage;

        detailedReason = `
Your portfolio currently has ${stablecoinPercentage.toFixed(1)}% in stablecoins, which is ${stablecoinPercentage < 30 ? 'below the recommended 30-40% for a conservative strategy' : 'within the conservative range but could be increased for more stability'}.

The largest volatile asset (${fromToken.symbol}) represents ${fromToken.percentage.toFixed(1)}% of your portfolio, which creates significant exposure to market volatility.

By moving ${(swapAmountPercentage * 100).toFixed(0)}% of your ${fromToken.symbol} holdings to ${toToken.symbol}, you'll reduce risk while maintaining some exposure to potential upside. This adjustment aligns with your conservative strategy preference by prioritizing capital preservation over growth potential.

Current market conditions suggest that holding more stablecoins provides a buffer against potential market corrections while giving you flexibility to capitalize on future opportunities.
`;
      } else if (stablecoinPercentage > 60) {
        // If the portfolio is too conservative (over 60% stablecoins), suggest a slight rebalance
        if (stablecoins.length > 0 && sortedTokens.length > stablecoins.length) {
          fromToken = stablecoins[0];
          // Find a quality token that isn't a stablecoin
          const nonStableTokens = sortedTokens.filter(t => !stablecoins.includes(t));
          if (nonStableTokens.length > 0) {
            toToken = nonStableTokens[0];
            swapAmountPercentage = 0.15; // 15% of the stablecoin
            swapAmount = fromToken.value * swapAmountPercentage;

            detailedReason = `
Your portfolio is currently very conservative with ${stablecoinPercentage.toFixed(1)}% in stablecoins, which exceeds the typical 30-40% recommendation for a conservative strategy.

While this provides excellent protection against market volatility, you may be missing growth opportunities. Even conservative portfolios benefit from some market exposure.

I suggest moving a small portion (${(swapAmountPercentage * 100).toFixed(0)}%) of your ${fromToken.symbol} holdings to ${toToken.symbol}, which would still maintain a conservative approach but slightly increase your growth potential.

This adjustment preserves the majority of your stable position while adding a measured exposure to potential market gains.
`;
          }
        }
      } else {
        detailedReason = `
Your portfolio is well-balanced for a conservative strategy. You have ${stablecoinPercentage.toFixed(1)}% in stablecoins, providing good protection against market volatility.

The distribution across ${chainCounts} blockchain(s) and ${tokenTypeCounts} position type(s) offers adequate diversification.

At this time, no specific rebalancing is needed as your portfolio aligns well with conservative risk preferences. Continue monitoring market conditions for future adjustment opportunities.
`;
      }
      break;
    }

    case 'aggressive': {
      // Aggressive strategy prioritizes growth assets over stablecoins
      if (stablecoinPercentage > 30 && stablecoins.length > 0) {
        // Too much in stablecoins for an aggressive strategy
        fromToken = stablecoins[0];

        // Find a promising growth token
        const nonStableTokens = sortedTokens.filter(
          t => !stablecoins.includes(t) && t.type !== 'staked'
        );

        if (nonStableTokens.length > 0) {
          toToken = nonStableTokens[0];
          swapAmountPercentage = 0.4; // 40% of the stablecoin
          swapAmount = fromToken.value * swapAmountPercentage;

          detailedReason = `
For an aggressive growth strategy, your portfolio currently has ${stablecoinPercentage.toFixed(1)}% in stablecoins, which is higher than optimal for maximizing growth potential.

While stablecoins provide security, they typically don't generate significant returns in bull markets. Your growth-oriented strategy suggests you're comfortable with higher market exposure.

I recommend reallocating ${(swapAmountPercentage * 100).toFixed(0)}% of your ${fromToken.symbol} position to ${toToken.symbol} to increase your growth potential. ${toToken.symbol} shows stronger upside potential while still maintaining some diversification benefits.

This adjustment maintains some stablecoin reserves for security while positioning more of your portfolio for potential market appreciation.
`;
        }
      } else if (largestTokenPercentage < 30 && sortedTokens.length > 3) {
        // Portfolio is too diversified for an aggressive strategy
        // Find smaller positions to consolidate
        const smallerPositions = sortedTokens.filter(t => t.percentage < 10);
        if (smallerPositions.length > 0) {
          fromToken = smallerPositions[0];
          toToken = largestToken;
          swapAmountPercentage = 0.9; // 90% of the small position
          swapAmount = fromToken.value * swapAmountPercentage;

          detailedReason = `
Your portfolio appears to be highly diversified with no single position exceeding 30% of your total holdings. While diversification reduces risk, an aggressive strategy typically benefits from stronger conviction positions.

You currently have several smaller positions under 10% that aren't significant enough to meaningfully impact returns.

I suggest consolidating ${(swapAmountPercentage * 100).toFixed(0)}% of your ${fromToken.symbol} position (${fromToken.percentage.toFixed(1)}% of your portfolio) into ${toToken.symbol}, which is your largest current holding at ${largestToken.percentage.toFixed(1)}%.

This concentration increases your exposure to high-conviction assets, aligning better with an aggressive growth strategy while eliminating portfolio fragmentation.
`;
        }
      } else {
        detailedReason = `
Your portfolio structure appears well-aligned with an aggressive growth strategy. Your stablecoin allocation is ${stablecoinPercentage.toFixed(1)}%, which provides an appropriate balance between security and growth opportunity.

The distribution of assets shows good concentration in high-potential positions without excessive diversification that might dilute returns.

At this time, no specific rebalancing is needed as your allocation already supports your aggressive strategy. Continue monitoring market developments to capitalize on emerging opportunities.
`;
      }
      break;
    }

    case 'moderate':
    default: {
      // Moderate strategy aims for balance
      if (largestTokenPercentage > 40) {
        // If the largest token is over 40% of the portfolio, recommend diversifying
        fromToken = largestToken;

        // Find a token to diversify into, preferably on the same chain
        const otherTokens = sortedTokens.filter(
          t =>
            t.symbol !== largestToken.symbol &&
            t.type !== 'staked' &&
            t.chain === largestToken.chain
        );

        if (otherTokens.length > 0) {
          toToken = otherTokens[0];
          swapAmountPercentage = 0.25; // 25% of the largest token
          swapAmount = fromToken.value * swapAmountPercentage;

          detailedReason = `
Your portfolio currently has ${largestTokenPercentage.toFixed(1)}% concentrated in ${largestToken.symbol}, which creates significant concentration risk even for a moderate strategy.

A balanced portfolio typically avoids having any single asset exceed 30-40% of total holdings to mitigate volatility while still capturing growth.

I recommend rebalancing by moving ${(swapAmountPercentage * 100).toFixed(0)}% of your ${fromToken.symbol} position to ${toToken.symbol}, which operates on the same blockchain and offers complementary exposure.

This adjustment maintains your overall market exposure while reducing the impact of potential negative price movements in ${fromToken.symbol}.
`;
        }
      } else if (stablecoinPercentage < 15 && sortedTokens.length > 1) {
        // Not enough in stablecoins for a moderate strategy
        const nonStableTokens = sortedTokens.filter(t => !stablecoins.includes(t));
        if (nonStableTokens.length > 0 && stablecoins.length > 0) {
          fromToken = nonStableTokens[0];
          toToken = stablecoins[0];
          swapAmountPercentage = 0.2; // 20% of the token
          swapAmount = fromToken.value * swapAmountPercentage;

          detailedReason = `
Your portfolio has only ${stablecoinPercentage.toFixed(1)}% allocated to stablecoins, which is below the recommended 15-25% for a moderate strategy.

Limited stablecoin reserves reduce your ability to capitalize on market corrections or manage unexpected expenses without liquidating growth positions, potentially at unfavorable prices.

I suggest converting ${(swapAmountPercentage * 100).toFixed(0)}% of your ${fromToken.symbol} position to ${toToken.symbol} to increase your stablecoin allocation.

This adjustment maintains most of your market exposure while building a strategic reserve that enhances portfolio resilience and flexibility.
`;
        }
      } else if (chains.length === 1 && tokens.length > 3) {
        // Portfolio lacks chain diversification
        // Find the largest token and recommend a similar token on another chain
        fromToken = largestToken;

        const otherChainTokens = tokens.filter(t => t.chain !== largestToken.chain);
        if (otherChainTokens.length > 0) {
          toToken = otherChainTokens[0];
          swapAmountPercentage = 0.15; // 15% of the largest token
          swapAmount = fromToken.value * swapAmountPercentage;

          detailedReason = `
Your portfolio is currently concentrated on a single blockchain (${largestToken.chain}), which exposes you to chain-specific risks including technical issues, regulatory challenges, or ecosystem-specific downturns.

A moderate strategy typically benefits from cross-chain diversification to capture growth across different ecosystems while minimizing concentrated exposure.

I recommend allocating ${(swapAmountPercentage * 100).toFixed(0)}% of your ${fromToken.symbol} position to ${toToken.symbol} on the ${toToken.chain} blockchain.

This adjustment maintains your overall crypto exposure while spreading risk across multiple ecosystems and potentially capturing growth in different blockchain environments.
`;
        }
      } else {
        detailedReason = `
Your portfolio demonstrates good balance suitable for a moderate strategy. The largest position represents ${largestTokenPercentage.toFixed(1)}% of your holdings, providing focused exposure without excessive concentration.

Your stablecoin allocation (${stablecoinPercentage.toFixed(1)}%) provides an appropriate safety buffer while allowing substantial exposure to market growth.

The distribution across ${chainCounts} blockchain(s) and ${tokenTypeCounts} position type(s) offers healthy diversification.

At this time, no specific rebalancing is needed as your portfolio structure aligns well with a moderate risk profile. Continue regular monitoring to maintain this balance as markets evolve.
`;
      }
      break;
    }
  }

  return {
    riskLevel,
    fromToken,
    toToken,
    swapAmount,
    swapAmountPercentage,
    stablecoinPercentage,
    largestTokenPercentage,
    chainCounts,
    tokenTypeCounts,
    detailedReason,
  };
}

function calculateRiskLevel(tokens: TokenInfo[]): 'Low' | 'Medium' | 'High' {
  // Calculate stablecoin percentage
  const totalValue = tokens.reduce((sum, token) => sum + token.value, 0);
  const stablecoins = tokens.filter(
    t => t.symbol === 'USDC' || t.symbol === 'USDT' || t.symbol === 'DAI' || t.symbol === 'BUSD'
  );
  const stablecoinPercentage = stablecoins.reduce((sum, token) => sum + token.percentage, 0);

  // Get the largest token percentage
  const sortedTokens = [...tokens].sort((a, b) => b.value - a.value);
  const largestToken = sortedTokens[0];
  const largestTokenPercentage = largestToken ? largestToken.percentage : 0;

  // Calculate risk level based on stablecoin percentage and concentration
  if (stablecoinPercentage > 50 || (stablecoinPercentage > 30 && largestTokenPercentage < 30)) {
    return 'Low';
  } else if (stablecoinPercentage < 15 || largestTokenPercentage > 50) {
    return 'High';
  } else {
    return 'Medium';
  }
}

function formatAnalysisResponse(
  analysis: PortfolioAnalysis,
  tokens: TokenInfo[],
  totalValue: number
): string {
  const {
    riskLevel,
    fromToken,
    toToken,
    swapAmount,
    swapAmountPercentage,
    detailedReason,
    stablecoinPercentage,
    largestTokenPercentage,
    chainCounts,
    tokenTypeCounts,
  } = analysis;

  // Format token listing (top 5)
  const topTokens = [...tokens]
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)
    .map(t => `- ${t.symbol}: $${t.value.toFixed(2)} (${t.percentage.toFixed(1)}%)`)
    .join('\n');

  // Format portfolio summary
  let summary = `
## Detailed Portfolio Analysis

**Total Value:** $${totalValue.toFixed(2)}
**Risk Level:** ${riskLevel}
**Stablecoin Allocation:** ${stablecoinPercentage.toFixed(1)}%
**Largest Position:** ${largestTokenPercentage.toFixed(1)}% of portfolio
**Blockchain Diversification:** ${chainCounts} chain(s)
**Position Types:** ${tokenTypeCounts} type(s)

### Top Holdings
${topTokens}

### Analysis & Recommendation
`;

  // Add rebalance recommendation if available
  if (fromToken && toToken && swapAmount > 0) {
    // Calculate the token amount based on actual price data from Zerion
    let tokenAmount = 0;

    // Use the price from Zerion data to calculate token amount
    if (fromToken.price > 0) {
      tokenAmount = swapAmount / fromToken.price;
    }

    // Use a default value if we couldn't calculate properly
    if (tokenAmount <= 0) {
      tokenAmount = 1;
    }

    // Calculate the percentage of the token being swapped
    const swapPercentage = Math.round(swapAmountPercentage * 100);

    summary += `
I recommend swapping **${tokenAmount.toFixed(6)} ${fromToken.symbol}** (about $${swapAmount.toFixed(2)}, ${swapPercentage}% of your holdings) to **${toToken.symbol}**.

### Detailed Reasoning
${detailedReason}

This rebalancing would optimize your portfolio based on your strategy preferences while maintaining appropriate risk exposure.
`;
  } else {
    summary += `
${detailedReason}
`;
  }
  return summary;
}

export const analyzePortfolioToolFn: ToolFn = () => {
  return async ({ walletAddress, strategy }): Promise<ToolOutputValue[]> => {
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
      // Generate portfolio analysis
      const analysis = analyzePortfolio(tokens, strategy);
      // Format the response
      return [
        {
          type: 'text',
          content: formatAnalysisResponse(analysis, tokens, totalValue),
        },
      ];
    } catch (error: any) {
      return [
        {
          type: 'system:error',
          content: `Failed to analyze portfolio: ${error.message}`,
        },
      ];
    }
  };
};
