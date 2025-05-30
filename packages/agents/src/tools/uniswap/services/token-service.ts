import { CHAIN_CONFIG } from '@/config/chains';
import { TOKEN_INFO } from '@/config/tokens';
import { Token } from '@uniswap/sdk-core';

/**
 * Service for managing token information and operations
 */
export class TokenService {
  /**
   * Create a Token instance from symbol for use with Uniswap SDK
   *
   * @param chainName The blockchain network
   * @param symbol The token symbol
   * @returns Token instance or null if not found
   */
  public getToken(chainName: string, symbol: string): Token | null {
    // Check if chain is supported
    const chainConfig = CHAIN_CONFIG[chainName];
    if (!chainConfig) {
      console.error(`Chain ${chainName} not supported`);
      return null;
    }

    // Check if token exists on this chain
    const tokenInfo = TOKEN_INFO[chainName]?.[symbol];
    if (!tokenInfo) {
      console.error(`Token ${symbol} not found on ${chainName}`);
      return null;
    }

    // Create and return a Token instance
    try {
      return new Token(
        chainConfig.chainId,
        tokenInfo.address as `0x${string}`,
        tokenInfo.decimals,
        symbol,
        tokenInfo.name
      );
    } catch (error) {
      console.error(`Error creating token instance for ${symbol} on ${chainName}:`, error);
      return null;
    }
  }

  /**
   * Get all available token symbols for a chain
   *
   * @param chainName The blockchain network
   * @returns Array of token symbols
   */
  public getAvailableTokens(chainName: string): string[] {
    const chainTokens = TOKEN_INFO[chainName];
    return chainTokens ? Object.keys(chainTokens) : [];
  }

  /**
   * Check if a token is supported on a specific chain
   *
   * @param chainName The blockchain network
   * @param symbol The token symbol
   * @returns True if the token is supported
   */
  public isTokenSupported(chainName: string, symbol: string): boolean {
    return !!TOKEN_INFO[chainName]?.[symbol];
  }
}
