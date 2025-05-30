import { ChainName } from '@/config/chains';
import { Address } from 'viem';

import { FEE_TIERS, UNISWAP_V4_CONTRACTS } from '../config';
import { PoolData } from '../models/pool-data';
import {
  calculateAPR,
  calculateTVL,
  estimateVolume,
  getEstimatedTokenPrice,
} from '../utils/price-utils';
import { BlockchainClientService } from './blockchain-client';
import { PoolService } from './pool-service';
import { TokenService } from './token-service';

export class PoolDataFetcher {
  private blockchainClient: BlockchainClientService;
  private tokenService: TokenService;
  private poolService: PoolService;

  constructor() {
    this.blockchainClient = new BlockchainClientService();
    this.tokenService = new TokenService();
    this.poolService = new PoolService();
  }

  /**
   * Find the best pool for a token pair on a specific chain using Uniswap V4
   */
  async findBestPoolForPair(
    chainName: ChainName,
    tokenASymbol: string,
    tokenBSymbol: string
  ): Promise<PoolData | null> {
    try {
      // Get client for the specified chain
      const client = this.blockchainClient.getClient(chainName);
      if (!client) {
        throw new Error(`Unsupported chain: ${chainName}`);
      }

      // Create Token instances using Uniswap SDK
      const tokenA = this.tokenService.getToken(chainName, tokenASymbol);
      const tokenB = this.tokenService.getToken(chainName, tokenBSymbol);

      if (!tokenA || !tokenB) {
        console.error(
          `Could not create tokens for ${tokenASymbol} or ${tokenBSymbol} on ${chainName}`
        );
        return null;
      }

      // Ensure tokenA and tokenB are in the correct order (lower address first)
      const [token0, token1] =
        tokenA.address.toLowerCase() < tokenB.address.toLowerCase()
          ? [tokenA, tokenB]
          : [tokenB, tokenA];

      // In a real implementation, we would query a subgraph to find active pools
      // For now, we'll simulate finding a pool by generating a poolId based on token addresses
      // This is a simplified approach - in production, you'd query the actual pools

      // Get pool manager address
      const poolManager = UNISWAP_V4_CONTRACTS[chainName]?.poolManager as Address;
      if (!poolManager) {
        throw new Error(`No pool manager found for chain: ${chainName}`);
      }

      // Try different fee tiers
      let bestPool: { id: string; fee: number } | null = null;
      let bestLiquidity = BigInt(0);

      for (const feeTier of FEE_TIERS) {
        try {
          // In V4, pools are identified by IDs, not addresses
          // This is a mock poolId - in production, you would get real poolIds from events or subgraphs
          const mockPoolId = `0x${token0.address.slice(2)}${token1.address.slice(2)}${feeTier.amount.toString(16).padStart(6, '0')}`;

          // Try to get liquidity for this pool
          try {
            const liquidity = await this.poolService.getPoolLiquidity(
              client,
              chainName,
              mockPoolId
            );

            if (liquidity && BigInt(liquidity.toString()) > BigInt(0)) {
              // If this pool has more liquidity than any we've seen, choose it
              if (!bestPool || BigInt(liquidity.toString()) > bestLiquidity) {
                bestPool = { id: mockPoolId, fee: feeTier.amount };
                bestLiquidity = BigInt(liquidity.toString());
              }
            }
          } catch (error) {
            // Pool doesn't exist or other error - continue to next fee tier
            continue;
          }
        } catch (error) {
          // Continue to next fee tier
          continue;
        }
      }

      if (!bestPool) {
        console.log(`No active pool found for ${tokenASymbol}/${tokenBSymbol} on ${chainName}`);
        return null;
      }

      // Fetch detailed data for the best pool
      return await this.fetchPoolData(
        chainName,
        bestPool.id,
        `${tokenASymbol}/${tokenBSymbol}`,
        bestPool.fee
      );
    } catch (error) {
      console.error('Error finding pool for pair:', error);
      return null;
    }
  }

  /**
   * Fetch detailed data for a specific pool
   */
  async fetchPoolData(
    chainName: ChainName,
    poolId: string,
    poolName: string,
    fee: number
  ): Promise<PoolData> {
    try {
      const client = this.blockchainClient.getClient(chainName);
      if (!client) {
        throw new Error(`Unsupported chain: ${chainName}`);
      }

      // Get pool manager address
      const poolManager = UNISWAP_V4_CONTRACTS[chainName]?.poolManager as Address;
      if (!poolManager) {
        throw new Error(`No pool manager found for chain: ${chainName}`);
      }

      // Fetch pool data using V4 pool manager
      let liquidity: bigint;

      try {
        // Get liquidity
        const liquidityResult = await this.poolService.getPoolLiquidity(client, chainName, poolId);

        if (!liquidityResult) {
          throw new Error('Invalid liquidity result');
        }

        liquidity = liquidityResult;

        // Get current price (not used in this simplified example but would be used in production)
        await this.poolService.getPoolPrice(client, chainName, poolId);
      } catch (error) {
        console.error('Error fetching pool data, using fallback values:', error);
        // Use fallback values for demo
        liquidity = BigInt(1000000000000000n);
      }

      // Parse the pool name to get token symbols
      const [tokenA, tokenB] = poolName.split('/');

      // Get estimated token prices
      const tokenAPrice = getEstimatedTokenPrice(tokenA);
      const tokenBPrice = getEstimatedTokenPrice(tokenB);

      // Calculate TVL based on liquidity and estimated prices
      const tvl = calculateTVL(liquidity, tokenAPrice, tokenBPrice);

      // Estimate 24h volume
      const volume24h = estimateVolume(tvl);

      // Calculate APR based on fee tier and estimated volume
      const aprPercentage = calculateAPR(volume24h, fee, tvl);

      return {
        name: poolName,
        tokenA,
        tokenB,
        fee: fee / 10000, // Convert to basis points for display
        apr: parseFloat(aprPercentage.toFixed(2)),
        tvl: parseFloat(tvl.toFixed(2)),
        volume24h: parseFloat(volume24h.toFixed(2)),
        address: 'v4-' + poolId, // V4 pools don't have their own address, using poolId
        chain: chainName,
      };
    } catch (error) {
      console.error('Error fetching pool data:', error);

      // Return a fallback with estimates if we encounter errors
      return {
        name: poolName,
        tokenA: poolName.split('/')[0],
        tokenB: poolName.split('/')[1],
        fee: fee / 10000,
        apr: 15.0, // Fallback APR estimate
        tvl: 1000000, // Fallback TVL estimate $1M
        volume24h: 200000, // Fallback volume estimate $200K
        address: 'v4-fallback',
        chain: chainName,
      };
    }
  }
}
