import { DynamicStructuredTool } from '@langchain/core/tools';
import { ConfigService } from '@nestjs/config';
import { isAddress } from 'viem';
import { z } from 'zod';
import axios from 'axios';
import { ZerionFungiblePositionsResponse } from '../../zerion/types';
import { ZERION_V1_BASE_URL } from '../../zerion/constants';
import { getEncodedKey } from '../../zerion/zerion';
import {
  TokenInfo,
  LiquidityPairRecommendation,
  LiquidityPlan,
  RebalanceRecommendation,
} from './types';
import { TokenListManager } from './token-list';
import { PoolDataFetcher } from './pool-data-fetcher';
import { updateSwapWithTokenAddresses } from './swap-utils';

export function makeLiquidityProviderTool(configService: ConfigService) {
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

  // Create pool data fetcher for real-time pool data
  const poolDataFetcher = new PoolDataFetcher();

  /**
   * Create a liquidity pair recommendation
   */
  async function createLiquidityPairRecommendation(
    tokenA: TokenInfo,
    tokenB: TokenInfo,
    reason: string,
    liquidityValueA: number,
    liquidityValueB: number
  ): Promise<LiquidityPairRecommendation> {
    const chain = tokenA.chain === tokenB.chain ? tokenA.chain : 'ethereum';

    // Calculate token amounts based on USD values and token prices
    const tokenAmountA = tokenA.price > 0 ? liquidityValueA / tokenA.price : 0;
    const tokenAmountB = tokenB.price > 0 ? liquidityValueB / tokenB.price : 0;

    // Try to fetch real pool data for the token pair
    let pairRisk: 'Low' | 'Medium' | 'High' = 'Medium';
    let expectedAPR = 10.0; // Default fallback APR

    try {
      // Fetch pool data from Uniswap for this pair
      const poolData = await poolDataFetcher.findBestPoolForPair(
        chain,
        tokenA.symbol,
        tokenB.symbol
      );

      if (poolData) {
        // Use real pool data if available
        pairRisk = determineRiskFromAPR(poolData.apr);
        expectedAPR = poolData.apr;
        console.log(
          `Found pool data for ${tokenA.symbol}/${tokenB.symbol}: APR ${expectedAPR}%, TVL $${poolData.tvl}`
        );
      } else {
        // Fall back to estimation if no pool data is available
        pairRisk = assessPairRisk(tokenA, tokenB);
        expectedAPR = estimateAPR(tokenA, tokenB);
        console.log(`No pool data found for ${tokenA.symbol}/${tokenB.symbol}, using estimates`);
      }
    } catch (error) {
      console.error('Error fetching pool data:', error);
      // Fall back to estimation if there's an error
      pairRisk = assessPairRisk(tokenA, tokenB);
      expectedAPR = estimateAPR(tokenA, tokenB);
    }

    // Create placeholder link that will be updated with token addresses
    const uniswapLink = `https://app.uniswap.org/positions/create/v4?chain=${chain}`;

    return {
      tokenA,
      tokenB,
      reason,
      uniswapLink,
      liquidityValueA,
      liquidityValueB,
      tokenAmountA,
      tokenAmountB,
      expectedAPR,
      pairRisk,
    };
  }

  /**
   * Determine risk level based on APR
   */
  function determineRiskFromAPR(apr: number): 'Low' | 'Medium' | 'High' {
    if (apr < 8) return 'Low';
    if (apr < 20) return 'Medium';
    return 'High';
  }

  /**
   * Assess the risk level of a token pair (fallback method)
   */
  function assessPairRisk(tokenA: TokenInfo, tokenB: TokenInfo): 'Low' | 'Medium' | 'High' {
    // Determine if either token is a stablecoin
    const isStablecoinA = ['USDC', 'USDT', 'DAI', 'BUSD'].includes(tokenA.symbol);
    const isStablecoinB = ['USDC', 'USDT', 'DAI', 'BUSD'].includes(tokenB.symbol);

    // Stable-Stable pairs are low risk
    if (isStablecoinA && isStablecoinB) {
      return 'Low';
    }

    // Stable-Token pairs are medium risk
    if (isStablecoinA || isStablecoinB) {
      return 'Medium';
    }

    // Token-Token pairs with different types can be high risk (impermanent loss)
    return 'High';
  }

  /**
   * Estimate APR for a token pair (fallback method)
   */
  function estimateAPR(tokenA: TokenInfo, tokenB: TokenInfo): number {
    // Determine if either token is a stablecoin
    const isStablecoinA = ['USDC', 'USDT', 'DAI', 'BUSD'].includes(tokenA.symbol);
    const isStablecoinB = ['USDC', 'USDT', 'DAI', 'BUSD'].includes(tokenB.symbol);

    // Very rough estimates based on pair type
    if (isStablecoinA && isStablecoinB) {
      // Stable-Stable pairs typically have lower APR
      return 3.5; // 3.5%
    } else if (isStablecoinA || isStablecoinB) {
      // Stable-Token pairs have medium APR
      return 12.0; // 12%
    } else {
      // Token-Token pairs can have higher APR but with greater risk
      return 20.0; // 20%
    }
  }

  /**
   * Update liquidity recommendation with token addresses and final Uniswap link
   */
  async function updateRecommendationWithTokenAddresses(
    recommendation: LiquidityPairRecommendation
  ): Promise<LiquidityPairRecommendation> {
    const { tokenA, tokenB } = recommendation;
    const chain = tokenA.chain === tokenB.chain ? tokenA.chain : 'ethereum';

    try {
      // Use token addresses from the tokens themselves if available
      let addressA = tokenA.address || '';
      let addressB = tokenB.address || '';

      // Check if either token is the chain's native token (e.g., ETH on Ethereum)
      const isNativeA =
        tokenA.symbol === 'ETH' &&
        (chain === 'ethereum' || chain === 'optimism' || chain === 'arbitrum' || chain === 'base');
      const isNativeB =
        tokenB.symbol === 'ETH' &&
        (chain === 'ethereum' || chain === 'optimism' || chain === 'arbitrum' || chain === 'base');
      const isNativeMatic = tokenA.symbol === 'MATIC' && chain === 'polygon';
      const isNativeMaticB = tokenB.symbol === 'MATIC' && chain === 'polygon';

      // If addresses are not available in the token info, look them up from token lists
      if (!addressA && !isNativeA && !isNativeMatic) {
        addressA = await tokenListManager.getTokenAddress(chain, tokenA.symbol);
      }

      if (!addressB && !isNativeB && !isNativeMaticB) {
        addressB = await tokenListManager.getTokenAddress(chain, tokenB.symbol);
      }

      // Generate the Uniswap link with the correct parameters
      const currencyA = isNativeA || isNativeMatic ? 'NATIVE' : addressA;
      const currencyB = isNativeB || isNativeMaticB ? 'NATIVE' : addressB;

      const uniswapLink = `https://app.uniswap.org/positions/create/v4?currencyA=${currencyA}&currencyB=${currencyB}&chain=${chain}`;

      // Return updated recommendation
      return {
        ...recommendation,
        uniswapLink,
      };
    } catch (error) {
      console.error('Error updating liquidity recommendation with token addresses:', error);
      // Return the original recommendation if lookup fails
      return recommendation;
    }
  }

  /**
   * Find the best token pairs for liquidity provision from a user's portfolio
   */
  async function findBestLiquidityPairs(
    tokens: TokenInfo[]
  ): Promise<LiquidityPairRecommendation | null> {
    // Need at least 2 tokens to form a pair
    if (tokens.length < 2) {
      return null;
    }

    // Sort tokens by value (descending)
    const sortedTokens = [...tokens].sort((a, b) => b.value - a.value);

    // Look for stablecoins
    const stablecoins = sortedTokens.filter(t =>
      ['USDC', 'USDT', 'DAI', 'BUSD'].includes(t.symbol)
    );

    // Identify ETH/native tokens
    const ethereumTokens = sortedTokens.filter(t => t.symbol === 'ETH' || t.symbol === 'WETH');

    // Look for tokens on the same chain
    const groupedByChain = tokens.reduce(
      (acc, token) => {
        if (!acc[token.chain]) {
          acc[token.chain] = [];
        }
        acc[token.chain].push(token);
        return acc;
      },
      {} as Record<string, TokenInfo[]>
    );

    // Find the chain with the most tokens
    let bestChain = '';
    let maxTokens = 0;
    for (const [chain, chainTokens] of Object.entries(groupedByChain)) {
      if (chainTokens.length > maxTokens) {
        maxTokens = chainTokens.length;
        bestChain = chain;
      }
    }

    // Priority 1: Stablecoin + ETH pair (popular and often lucrative pair)
    if (stablecoins.length > 0 && ethereumTokens.length > 0) {
      const stablecoin = stablecoins[0];
      const eth = ethereumTokens[0];

      // Make sure they're on the same chain
      if (stablecoin.chain === eth.chain) {
        // Determine liquidity values (50/50 balance is ideal for most pools)
        // Use up to 30% of each token's value, but ensure balanced USD value
        const maxLiquidityValue = Math.min(stablecoin.value * 0.3, eth.value * 0.3);

        return await createLiquidityPairRecommendation(
          eth,
          stablecoin,
          `The ETH/${stablecoin.symbol} pair is one of the most liquid and popular trading pairs on Uniswap, offering solid fee generation with moderate risk.`,
          maxLiquidityValue,
          maxLiquidityValue
        );
      }
    }

    // Priority 2: Two largest tokens on the same chain
    if (bestChain && groupedByChain[bestChain].length >= 2) {
      const chainTokens = groupedByChain[bestChain].sort((a, b) => b.value - a.value);
      const tokenA = chainTokens[0];
      const tokenB = chainTokens[1];

      // Determine liquidity values
      const maxLiquidityValue = Math.min(tokenA.value * 0.3, tokenB.value * 0.3);

      return await createLiquidityPairRecommendation(
        tokenA,
        tokenB,
        `This pair utilizes your two largest holdings on the ${bestChain} blockchain, allowing you to earn fees while maintaining exposure to both assets.`,
        maxLiquidityValue,
        maxLiquidityValue
      );
    }

    // Priority 3: Stablecoin pair if multiple stablecoins are available
    if (stablecoins.length >= 2) {
      const stablecoinA = stablecoins[0];
      const stablecoinB = stablecoins[1];

      // Make sure they're on the same chain
      if (stablecoinA.chain === stablecoinB.chain) {
        // Stablecoin pairs are safer for higher percentage of holdings
        const maxLiquidityValue = Math.min(stablecoinA.value * 0.5, stablecoinB.value * 0.5);

        return await createLiquidityPairRecommendation(
          stablecoinA,
          stablecoinB,
          `This stablecoin pair provides a low-risk option for earning fees with minimal impermanent loss risk, a good choice for conservative liquidity provision.`,
          maxLiquidityValue,
          maxLiquidityValue
        );
      }
    }

    // Fallback: Use the top two tokens by value if all else fails
    if (sortedTokens.length >= 2) {
      const tokenA = sortedTokens[0];
      const tokenB = sortedTokens[1];

      // Only suggest if they're on the same chain
      if (tokenA.chain === tokenB.chain) {
        // More conservative allocation since this is a fallback
        const maxLiquidityValue = Math.min(tokenA.value * 0.2, tokenB.value * 0.2);

        return await createLiquidityPairRecommendation(
          tokenA,
          tokenB,
          `This pair uses your two largest holdings to generate fee income, though be aware of potential impermanent loss if prices diverge significantly.`,
          maxLiquidityValue,
          maxLiquidityValue
        );
      }
    }

    return null;
  }

  /**
   * Create a comprehensive liquidity plan that may include rebalancing first
   */
  function createLiquidityPlan(
    tokens: TokenInfo[],
    pairRecommendation: LiquidityPairRecommendation
  ): LiquidityPlan {
    const { tokenA, tokenB, liquidityValueA, liquidityValueB, pairRisk } = pairRecommendation;

    // Check if user has enough of both tokens or needs to rebalance
    const hasEnoughTokenA = tokenA.value >= liquidityValueA;
    const hasEnoughTokenB = tokenB.value >= liquidityValueB;

    let swapRecommendation: RebalanceRecommendation | undefined;
    let detailedReason = '';

    // If user needs to acquire or increase one of the tokens
    if (!hasEnoughTokenA || !hasEnoughTokenB) {
      // Determine which token needs to be acquired
      const targetToken = !hasEnoughTokenA ? tokenA : tokenB;
      const shortfall = !hasEnoughTokenA
        ? liquidityValueA - tokenA.value
        : liquidityValueB - tokenB.value;

      // Find a token to swap from (preferably a token not in the pair)
      const otherTokens = tokens.filter(
        t =>
          t.symbol !== tokenA.symbol &&
          t.symbol !== tokenB.symbol &&
          t.value >= shortfall &&
          t.chain === targetToken.chain
      );

      if (otherTokens.length > 0) {
        // Found a suitable token to swap from
        const sourceToken = otherTokens[0];

        // Calculate token amount based on source token's price
        const tokenAmount = sourceToken.price > 0 ? shortfall / sourceToken.price : 0;

        // Create a swap recommendation
        swapRecommendation = {
          fromToken: sourceToken,
          toToken: targetToken,
          reason: `You need additional ${targetToken.symbol} to optimize your liquidity position`,
          uniswapLink: '', // This will be filled in by the rebalance tool
          valueToSwap: shortfall,
          tokenAmount,
        };

        detailedReason = `
Before providing liquidity, I recommend first swapping $${shortfall.toFixed(2)} worth of ${sourceToken.symbol} to ${targetToken.symbol} to optimize your liquidity position.

This will ensure you have balanced amounts of both tokens for the ${tokenA.symbol}/${tokenB.symbol} pool, which is recommended for most efficient liquidity provision.

After completing this swap, you'll be ready to provide liquidity with the optimal token ratio.
`;
      } else {
        // No suitable token found, suggest using what they have
        detailedReason = `
You currently don't have enough ${targetToken.symbol} for the ideal liquidity position. You have $${targetToken.value.toFixed(2)} but would need $${(!hasEnoughTokenA ? liquidityValueA : liquidityValueB).toFixed(2)} for the optimal ratio.

I recommend either:
1. Acquiring more ${targetToken.symbol} from an exchange before providing liquidity, or
2. Proceeding with a smaller liquidity position using the maximum amount available of both tokens.

The current recommendation uses the maximum amount you can provide with balanced values.
`;

        // Adjust liquidity values to what the user actually has
        const adjustedLiquidityValue = Math.min(tokenA.value, tokenB.value);
        pairRecommendation.liquidityValueA = adjustedLiquidityValue;
        pairRecommendation.liquidityValueB = adjustedLiquidityValue;
      }
    } else {
      // User has enough of both tokens
      detailedReason = `
You have sufficient amounts of both ${tokenA.symbol} and ${tokenB.symbol} to provide optimal liquidity to this pool.

By adding $${liquidityValueA.toFixed(2)} worth of ${tokenA.symbol} and $${liquidityValueB.toFixed(2)} worth of ${tokenB.symbol}, you'll create a well-balanced position that can generate fees while maintaining exposure to both assets.

The estimated APR for this pool is around ${pairRecommendation.expectedAPR?.toFixed(1)}%, with a risk assessment of ${pairRisk} based on the pair's characteristics.
`;
    }

    const totalValueLocked = liquidityValueA + liquidityValueB;

    return {
      swapRecommendation,
      liquidityRecommendation: pairRecommendation,
      totalValueLocked,
      overallRisk: pairRisk,
      detailedReason,
    };
  }

  /**
   * Format the response for the liquidity plan
   */
  function formatLiquidityPlanResponse(plan: LiquidityPlan): string {
    const {
      swapRecommendation,
      liquidityRecommendation,
      totalValueLocked,
      overallRisk,
      detailedReason,
    } = plan;

    const {
      tokenA,
      tokenB,
      liquidityValueA,
      liquidityValueB,
      tokenAmountA,
      tokenAmountB,
      expectedAPR,
      uniswapLink,
      pairRisk,
    } = liquidityRecommendation;

    let response = `
## Liquidity Provision Recommendation

I recommend providing liquidity to the **${tokenA.symbol}/${tokenB.symbol}** pool on Uniswap.

### Key Details
- **Total Value:** $${totalValueLocked.toFixed(2)}
- **Token Amounts:** ${tokenAmountA?.toFixed(6)} ${tokenA.symbol} + ${tokenAmountB?.toFixed(6)} ${tokenB.symbol}
- **Risk Level:** ${overallRisk}
- **Estimated APR:** ${expectedAPR?.toFixed(1)}%

### Detailed Strategy
${detailedReason}
`;

    // Add swap recommendation if needed
    if (swapRecommendation) {
      response += `
### Step 1: Prepare by swapping tokens
First, swap $${swapRecommendation.valueToSwap.toFixed(2)} worth of ${swapRecommendation.fromToken.symbol} to ${swapRecommendation.toToken.symbol}:
@${swapRecommendation.uniswapLink}

### Step 2: Provide liquidity
After completing the swap, provide liquidity to the ${tokenA.symbol}/${tokenB.symbol} pool:
@${uniswapLink}
`;
    } else {
      response += `
### Provide Liquidity
You can provide liquidity to this pool directly on Uniswap:
@${uniswapLink}
`;
    }

    response += `
### Tips for Liquidity Providers
- Monitor your position regularly for changes in the impermanent loss
- Consider the gas costs when adding or removing liquidity
- Reinvest earned fees to compound your returns
`;

    return response;
  }

  return new DynamicStructuredTool({
    name: 'provide_liquidity_suggestion',
    description: `
Analyzes a user's crypto portfolio and suggests optimal token pairs for providing liquidity on Uniswap.
Returns a detailed recommendation with a pre-filled Uniswap liquidity provision link.

Triggers when users ask about providing liquidity, earning passive income with their crypto, or want to maximize yield.

Input:
- walletAddress: Wallet address to analyze (required)
- riskLevel: Preferred risk level for liquidity provision ("conservative", "moderate", or "aggressive")

Output:
- A detailed liquidity provision plan with reasoning and a pre-filled Uniswap link.
`,
    schema: z
      .object({
        walletAddress: z
          .string()
          .describe('The wallet address to analyze for liquidity provision opportunities'),
        riskLevel: z
          .enum(['conservative', 'moderate', 'aggressive'] as const)
          .describe('The preferred risk level for liquidity provision')
          .default('moderate'),
      })
      .describe('Input schema for liquidity provision suggestions'),
    func: async ({ walletAddress, riskLevel }) => {
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

        // Find the best liquidity pairs based on the user's portfolio
        const pairRecommendation = await findBestLiquidityPairs(tokens);

        if (!pairRecommendation) {
          return "Based on your current holdings, I don't see optimal token pairs for liquidity provision. Consider acquiring complementary assets or providing liquidity with a single asset on concentrated liquidity pools.";
        }

        // Update the recommendation with token addresses
        const updatedPairRecommendation =
          await updateRecommendationWithTokenAddresses(pairRecommendation);

        // Create a comprehensive liquidity plan
        const liquidityPlan = createLiquidityPlan(tokens, updatedPairRecommendation);

        // If the plan includes a swap recommendation, update that with addresses too
        if (liquidityPlan.swapRecommendation) {
          // Update the swap recommendation with token addresses
          liquidityPlan.swapRecommendation = await updateSwapWithTokenAddresses(
            liquidityPlan.swapRecommendation,
            tokenListManager
          );
        }

        // Format the response
        return formatLiquidityPlanResponse(liquidityPlan);
      } catch (error) {
        if (error instanceof Error) {
          return `Failed to generate liquidity provision suggestions: ${error.message}`;
        }
        return 'Failed to generate liquidity provision suggestions.';
      }
    },
  });
}
