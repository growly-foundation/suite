/**
 * Token information lookup by chain and symbol
 * Contains address, decimals and name for each token
 */
export const TOKEN_INFO: Record<
  string,
  Record<string, { address: string; decimals: number; name: string }>
> = {
  ethereum: {
    ETH: {
      address: '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2',
      decimals: 18,
      name: 'Wrapped Ether',
    }, // WETH
    USDC: { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', decimals: 6, name: 'USD Coin' },
    USDT: {
      address: '0xdAC17F958D2ee523a2206206994597C13D831ec7',
      decimals: 6,
      name: 'Tether USD',
    },
    DAI: {
      address: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
      decimals: 18,
      name: 'Dai Stablecoin',
    },
  },
  optimism: {
    ETH: {
      address: '0x4200000000000000000000000000000000000006',
      decimals: 18,
      name: 'Wrapped Ether',
    },
    USDC: { address: '0x7F5c764cBc14f9669B88837ca1490cCa17c31607', decimals: 6, name: 'USD Coin' },
    OP: { address: '0x4200000000000000000000000000000000000042', decimals: 18, name: 'Optimism' },
  },
  arbitrum: {
    ETH: {
      address: '0x82aF49447D8a07e3bd95BD0d56f35241523fBab1',
      decimals: 18,
      name: 'Wrapped Ether',
    },
    USDC: { address: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8', decimals: 6, name: 'USD Coin' },
    ARB: { address: '0x912CE59144191C1204E64559FE8253a0e49E6548', decimals: 18, name: 'Arbitrum' },
  },
  base: {
    ETH: {
      address: '0x4200000000000000000000000000000000000006',
      decimals: 18,
      name: 'Wrapped Ether',
    },
    USDC: { address: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', decimals: 6, name: 'USD Coin' },
  },
  polygon: {
    MATIC: {
      address: '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
      decimals: 18,
      name: 'Wrapped Matic',
    },
    USDC: { address: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174', decimals: 6, name: 'USD Coin' },
  },
};
