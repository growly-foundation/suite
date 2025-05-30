import { CHAIN_CONFIG, ChainName } from '@/config/chains';
import { PublicClient, createPublicClient, http } from 'viem';

/**
 * Service for managing blockchain client connections
 */
export class BlockchainClientService {
  private clients: Partial<Record<ChainName, PublicClient>> = {};

  /**
   * Initialize blockchain clients for all supported chains
   */
  constructor() {
    this.initializeClients();
  }

  /**
   * Create public client instances for each supported chain
   */
  private initializeClients(): void {
    Object.entries(CHAIN_CONFIG).forEach(([chainName, config]) => {
      this.clients[chainName] = createPublicClient({
        chain: config.chain,
        transport: http(config.rpcUrl),
      });
    });
  }

  /**
   * Get client for a specific chain
   *
   * @param chainName Name of the chain to get client for
   * @returns Public client for the specified chain or null if not supported
   */
  public getClient(chainName: ChainName): PublicClient | null {
    return this.clients[chainName] || null;
  }

  /**
   * Check if a chain is supported
   *
   * @param chainName Name of the chain to check
   * @returns True if the chain is supported
   */
  public isChainSupported(chainName: ChainName): boolean {
    return !!this.clients[chainName];
  }

  /**
   * Get all supported chain names
   *
   * @returns Array of supported chain names
   */
  public getSupportedChains(): ChainName[] {
    return Object.keys(this.clients) as ChainName[];
  }
}
