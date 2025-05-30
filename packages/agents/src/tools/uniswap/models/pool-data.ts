/**
 * Represents liquidity pool data with key metrics
 */
export interface PoolData {
  /** Pool name in format TokenA/TokenB */
  name: string;

  /** First token symbol */
  tokenA: string;

  /** Second token symbol */
  tokenB: string;

  /** Fee tier in basis points */
  fee: number;

  /** Annual percentage rate */
  apr: number;

  /** Total value locked in USD */
  tvl: number;

  /** 24-hour trading volume in USD */
  volume24h: number;

  /** Pool address or identifier */
  address: string;

  /** Blockchain network */
  chain: string;
}

/**
 * Pool keys returned from position manager
 */
export interface PoolKeys {
  currency0: `0x${string}`;
  currency1: `0x${string}`;
  fee: number;
  tickSpacing: number;
  hooks: `0x${string}`;
}
