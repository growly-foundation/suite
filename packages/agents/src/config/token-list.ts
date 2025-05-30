import axios from 'axios';

import { CHAIN_IDS, ChainName } from './chains';

// Token list interfaces
export interface TokenList {
  name: string;
  tokens: Token[];
  version: {
    major: number;
    minor: number;
    patch: number;
  };
}

export interface Token {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI?: string;
}

// Token list sources
const TOKEN_LIST_SOURCES = {
  superchain: 'https://static.optimism.io/optimism.tokenlist.json',
  // uniswap: 'https://ipfs.io/ipns/tokens.uniswap.org',
};

/**
 * Class to manage token lists from multiple sources
 */
export class TokenListManager {
  private tokenCache: Map<string, Record<string, Record<string, string>>> = new Map();
  private lastFetched: Date | null = null;

  /**
   * Fetch token lists from all sources and build token address mapping
   */
  async fetchTokenLists(): Promise<Record<string, Record<string, string>>> {
    try {
      // Check if we have cached data less than 1 hour old
      if (this.lastFetched && new Date().getTime() - this.lastFetched.getTime() < 3600000) {
        const cachedData = this.tokenCache.get('tokenList');
        if (cachedData) {
          return cachedData;
        }
      }

      // Fetch token lists from all sources
      const [superchainList] = await Promise.all([
        this.fetchTokenList(TOKEN_LIST_SOURCES.superchain),
      ]);

      // Combine the lists
      const combinedTokens = [...superchainList.tokens];

      // Build the token address mapping by chain and symbol
      const tokenMap: Record<string, Record<string, string>> = {};

      // Initialize empty objects for each chain
      Object.keys(CHAIN_IDS).forEach(chain => {
        tokenMap[chain] = {};
      });

      // Populate the map
      for (const token of combinedTokens) {
        // Get chain name from ID
        const chainName = this.getChainNameFromId(token.chainId);
        if (!chainName) continue;

        // Add to the mapping
        if (tokenMap[chainName]) {
          tokenMap[chainName][token.symbol] = token.address;
        }
      }

      // Add fallback popular tokens if they're missing
      this.addFallbackTokens(tokenMap);

      // Cache the result
      this.tokenCache.set('tokenList', tokenMap);
      this.lastFetched = new Date();

      return tokenMap;
    } catch (error) {
      console.error('Error fetching token lists:', error);
      // Return basic fallback mapping if fetch fails
      return this.getFallbackTokenMap();
    }
  }

  /**
   * Fetch a single token list from a URL
   */
  private async fetchTokenList(url: string): Promise<TokenList> {
    try {
      const response = await axios.get<TokenList>(url);
      return response.data;
    } catch (error) {
      console.error(`Error fetching token list from ${url}:`, error);
      // Return an empty list if fetch fails
      return { name: 'Empty', tokens: [], version: { major: 0, minor: 0, patch: 0 } };
    }
  }

  /**
   * Get chain name from chain ID
   */
  private getChainNameFromId(chainId: number): string | null {
    for (const [name, id] of Object.entries(CHAIN_IDS)) {
      if (id === chainId) {
        return name;
      }
    }
    return null;
  }

  /**
   * Add fallback tokens to ensure essential tokens are available
   */
  private addFallbackTokens(tokenMap: Record<string, Record<string, string>>) {
    // Essential Ethereum tokens
    if (tokenMap.ethereum) {
      tokenMap.ethereum.ETH =
        tokenMap.ethereum.ETH ||
        tokenMap.ethereum.WETH ||
        '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2';
      tokenMap.ethereum.USDC =
        tokenMap.ethereum.USDC || '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
      tokenMap.ethereum.USDT =
        tokenMap.ethereum.USDT || '0xdac17f958d2ee523a2206206994597c13d831ec7';
      tokenMap.ethereum.DAI = tokenMap.ethereum.DAI || '0x6b175474e89094c44da98b954eedeac495271d0f';
    }

    // Essential Polygon tokens
    if (tokenMap.polygon) {
      tokenMap.polygon.MATIC =
        tokenMap.polygon.MATIC ||
        tokenMap.polygon.WMATIC ||
        '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270';
      tokenMap.polygon.USDC = tokenMap.polygon.USDC || '0x2791bca1f2de4661ed88a30c99a7a9449aa84174';
    }

    // Essential Optimism tokens
    if (tokenMap.optimism) {
      tokenMap.optimism.ETH =
        tokenMap.optimism.ETH ||
        tokenMap.optimism.WETH ||
        '0x4200000000000000000000000000000000000006';
      tokenMap.optimism.USDC =
        tokenMap.optimism.USDC || '0x7f5c764cbc14f9669b88837ca1490cca17c31607';
    }

    // Essential Arbitrum tokens
    if (tokenMap.arbitrum) {
      tokenMap.arbitrum.ETH =
        tokenMap.arbitrum.ETH ||
        tokenMap.arbitrum.WETH ||
        '0x82af49447d8a07e3bd95bd0d56f35241523fbab1';
      tokenMap.arbitrum.USDC =
        tokenMap.arbitrum.USDC || '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8';
    }
  }

  /**
   * Get fallback token map in case external fetching fails
   */
  private getFallbackTokenMap(): Record<string, Record<string, string>> {
    return {
      ethereum: {
        USDC: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
        ETH: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
        DAI: '0x6b175474e89094c44da98b954eedeac495271d0f',
        USDT: '0xdac17f958d2ee523a2206206994597c13d831ec7',
      },
      polygon: {
        USDC: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
        MATIC: '0x0d500b1d8e8ef31e21c99d1db9a6444d3adf1270',
      },
      optimism: {
        USDC: '0x7f5c764cbc14f9669b88837ca1490cca17c31607',
        ETH: '0x4200000000000000000000000000000000000006',
      },
      arbitrum: {
        USDC: '0xff970a61a04b1ca14834a43f5de4533ebddb5cc8',
        ETH: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
      },
      base: {
        USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
        ETH: '0x4200000000000000000000000000000000000006',
      },
    };
  }

  /**
   * Get token address by chain and symbol
   */
  async getTokenAddress(chain: ChainName, symbol: string): Promise<string> {
    // Hardcoded check for USDC on Base
    if (chain === 'base' && symbol === 'USDC') {
      return '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
    }

    const tokenMap = await this.fetchTokenLists();

    if (tokenMap[chain] && tokenMap[chain][symbol]) {
      return tokenMap[chain][symbol];
    }

    // If not found, return a default token for the chain
    if (tokenMap[chain]) {
      // For ETH chains, return wrapped ETH
      if (['ethereum', 'optimism', 'arbitrum', 'base'].includes(chain)) {
        return tokenMap[chain].ETH || tokenMap[chain].WETH || '';
      }
      // For other chains, return the native token or USDC
      return tokenMap[chain].MATIC || tokenMap[chain].USDC || '';
    }

    // Fallback to Ethereum USDC if chain not found
    return '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48';
  }
}
