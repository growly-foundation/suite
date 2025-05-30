/**
 * Utilities for estimating token prices and calculating pool metrics
 */

/**
 * Get estimated token price for demonstration purposes
 * In production, this would be replaced with actual price feeds
 *
 * @param tokenSymbol Symbol of the token to estimate
 * @returns Estimated price in USD
 */
export function getEstimatedTokenPrice(tokenSymbol: string): number {
  return tokenSymbol === 'ETH'
    ? 3000
    : tokenSymbol === 'USDC' || tokenSymbol === 'USDT' || tokenSymbol === 'DAI'
      ? 1
      : tokenSymbol === 'OP' || tokenSymbol === 'ARB'
        ? 2
        : tokenSymbol === 'MATIC'
          ? 0.5
          : 10;
}

/**
 * Calculate estimated TVL based on liquidity and token prices
 *
 * @param liquidity Pool liquidity
 * @param tokenAPrice Price of token A
 * @param tokenBPrice Price of token B
 * @returns Estimated TVL in USD
 */
export function calculateTVL(liquidity: bigint, tokenAPrice: number, tokenBPrice: number): number {
  const liquidityNumber = Number(liquidity);
  return (liquidityNumber * (tokenAPrice + tokenBPrice)) / 1e9;
}

/**
 * Calculate estimated APR based on volume, fee tier, and TVL
 *
 * @param volume24h 24-hour trading volume
 * @param feeTier Fee tier in wei (millionths)
 * @param tvl Total value locked
 * @returns APR as percentage
 */
export function calculateAPR(volume24h: number, feeTier: number, tvl: number): number {
  return ((volume24h * (feeTier / 1000000) * 365) / tvl) * 100;
}

/**
 * Estimate 24-hour volume based on TVL
 *
 * @param tvl Total value locked
 * @returns Estimated 24-hour volume
 */
export function estimateVolume(tvl: number): number {
  // Assume 20% of TVL is traded daily for estimation purposes
  return tvl * 0.2;
}
