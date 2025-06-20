export enum PersonaTrait {
  OG = 'OG',
  DEFI_CHAD = 'DeFi Chad',
  DEGEN = 'Degen',
  VIRGIN_CT = 'Virgin CT',
}

export enum WeightLevel {
  HIGH = 3,
  MEDIUM = 2,
  LOW = 1,
}

export interface TraitMetric {
  name: string;
  weight: WeightLevel;
  satisfied: boolean;
}

export interface TraitScore {
  trait: PersonaTrait;
  score: number;
  metrics: TraitMetric[];
}

export interface WalletMetrics {
  walletCreationDate: Date;
  totalPortfolioValue: number;
  tokenPortfolioValue: number;
  nftPortfolioValue: number;
  tokenAllocationPercentage: number;
  longestHoldingPeriodMonths: number;
  topAssetValue: number;
  topAssetType: 'token' | 'nft';
  activeDaysLast12Months: number;
  totalTokenActivitiesLast12Months: number;
  ethHolding: number;
  topTokenSymbol?: string;
}

export interface PersonaAnalysis {
  dominantTrait: PersonaTrait;
  traitScores: TraitScore[];
  walletMetrics: WalletMetrics;
}
