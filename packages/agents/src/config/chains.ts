import { ChainId } from '@uniswap/sdk-core';
import { Chain, arbitrum, base, mainnet, optimism, polygon } from 'viem/chains';

export type ChainName = 'ethereum' | 'optimism' | 'arbitrum' | 'base' | 'polygon';

// Mapping of chain names to chain IDs
export const CHAIN_IDS: Record<ChainName, number> = {
  ethereum: 1,
  polygon: 137,
  arbitrum: 42161,
  optimism: 10,
  base: 8453,
};

/**
 * Configuration for supported chains with their RPC URLs and ChainIds
 */
export const CHAIN_CONFIG: Record<ChainName, { chain: Chain; rpcUrl: string; chainId: ChainId }> = {
  ethereum: {
    chain: mainnet,
    rpcUrl: 'https://eth.llamarpc.com',
    chainId: ChainId.MAINNET,
  },
  optimism: {
    chain: optimism,
    rpcUrl: 'https://optimism.llamarpc.com',
    chainId: ChainId.OPTIMISM,
  },
  arbitrum: {
    chain: arbitrum,
    rpcUrl: 'https://arbitrum.llamarpc.com',
    chainId: ChainId.ARBITRUM_ONE,
  },
  base: {
    chain: base,
    rpcUrl: 'https://base.llamarpc.com',
    chainId: ChainId.BASE,
  },
  polygon: {
    chain: polygon,
    rpcUrl: 'https://polygon.llamarpc.com',
    chainId: ChainId.POLYGON,
  },
};
