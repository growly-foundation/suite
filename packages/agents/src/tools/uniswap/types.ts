import { ChainName } from '@/config/chains';

export interface TokenInfo {
  symbol: string;
  name: string;
  chain: ChainName;
  address: string | null;
  value: number;
  percentage: number;
  type: string;
  price: number;
  quantity: number;
}

export interface RebalanceRecommendation {
  fromToken: TokenInfo;
  toToken: TokenInfo;
  reason: string;
  uniswapLink: string;
  valueToSwap: number;
  tokenAmount?: number;
}

export interface LiquidityPairRecommendation {
  tokenA: TokenInfo;
  tokenB: TokenInfo;
  reason: string;
  uniswapLink: string;
  liquidityValueA: number;
  liquidityValueB: number;
  tokenAmountA?: number;
  tokenAmountB?: number;
  expectedAPR?: number;
  pairRisk: 'Low' | 'Medium' | 'High';
}

export interface LiquidityPlan {
  swapRecommendation?: RebalanceRecommendation;
  liquidityRecommendation: LiquidityPairRecommendation;
  totalValueLocked: number;
  overallRisk: 'Low' | 'Medium' | 'High';
  detailedReason: string;
}

export interface PortfolioAnalysis {
  riskLevel: 'Low' | 'Medium' | 'High';
  fromToken: TokenInfo | null;
  toToken: TokenInfo | null;
  swapAmount: number;
  swapAmountPercentage: number;
  stablecoinPercentage: number;
  largestTokenPercentage: number;
  chainCounts: number;
  tokenTypeCounts: number;
  detailedReason: string;
  tokenAmount?: number;
}

export enum RebalancingStrategy {
  CONSERVATIVE = 'conservative',
  MODERATE = 'moderate',
  AGGRESSIVE = 'aggressive',
}
