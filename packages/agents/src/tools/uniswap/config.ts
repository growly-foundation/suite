/**
 * Uniswap V4 contract addresses by chain
 */
export const UNISWAP_V4_CONTRACTS = {
  ethereum: {
    poolManager: '0xAeB3B597b15429CC6F96327f80AF3F149Ba667D0',
    positionManager: '0x1c0B01a7384f75B6256F98e7accb44456F1F0669',
  },
  optimism: {
    poolManager: '0xAeB3B597b15429CC6F96327f80AF3F149Ba667D0',
    positionManager: '0x1c0B01a7384f75B6256F98e7accb44456F1F0669',
  },
  arbitrum: {
    poolManager: '0xAeB3B597b15429CC6F96327f80AF3F149Ba667D0',
    positionManager: '0x1c0B01a7384f75B6256F98e7accb44456F1F0669',
  },
  base: {
    poolManager: '0xAeB3B597b15429CC6F96327f80AF3F149Ba667D0',
    positionManager: '0x1c0B01a7384f75B6256F98e7accb44456F1F0669',
  },
  polygon: {
    poolManager: '0xAeB3B597b15429CC6F96327f80AF3F149Ba667D0',
    positionManager: '0x1c0B01a7384f75B6256F98e7accb44456F1F0669',
  },
};

/**
 * Common fee values used for pools (in basis points)
 */
export const FEE_TIERS = [
  { amount: 100, name: '0.01%' }, // 1 basis point
  { amount: 500, name: '0.05%' }, // 5 basis points
  { amount: 3000, name: '0.3%' }, // 30 basis points
  { amount: 10000, name: '1%' }, // 100 basis points
];
