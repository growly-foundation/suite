import { POOL_MANAGER_ABI, POSITION_MANAGER_ABI } from '@/config/abis';
import { Address, PublicClient } from 'viem';

import { UNISWAP_V4_CONTRACTS } from '../config';
import { PoolKeys } from '../models/pool-data';

/**
 * Service for interacting with Uniswap pool contracts
 */
export class PoolService {
  /**
   * Get pool keys from position manager
   *
   * @param client Blockchain client
   * @param chainName Chain name
   * @param poolId Pool identifier
   * @returns Pool keys or null if not found
   */
  public async getPoolKeys(
    client: PublicClient,
    chainName: string,
    poolId: string
  ): Promise<PoolKeys | null> {
    try {
      // Get contract addresses for the specified chain
      const contracts = UNISWAP_V4_CONTRACTS[chainName];
      if (!contracts) {
        throw new Error(`Contracts not found for chain: ${chainName}`);
      }

      const positionManager = contracts.positionManager as Address;

      // Call the poolKeys function on the position manager contract
      const result = await client.readContract({
        address: positionManager,
        abi: POSITION_MANAGER_ABI,
        functionName: 'poolKeys',
        args: [poolId as `0x${string}`],
      });

      // Ensure the result has the expected structure
      if (!result || !Array.isArray(result) || result.length < 5) {
        throw new Error('Invalid pool keys result');
      }

      // Extract and return the pool keys
      return {
        currency0: result[0] as `0x${string}`,
        currency1: result[1] as `0x${string}`,
        fee: Number(result[2]),
        tickSpacing: Number(result[3]),
        hooks: result[4] as `0x${string}`,
      };
    } catch (error) {
      console.error(`Error fetching pool keys for ${poolId} on ${chainName}:`, error);
      return null;
    }
  }

  /**
   * Get pool liquidity
   *
   * @param client Blockchain client
   * @param chainName Chain name
   * @param poolId Pool identifier
   * @returns Pool liquidity as bigint or null on error
   */
  public async getPoolLiquidity(
    client: PublicClient,
    chainName: string,
    poolId: string
  ): Promise<bigint | null> {
    try {
      const poolManager = UNISWAP_V4_CONTRACTS[chainName]?.poolManager as Address;

      const liquidityResult = await client.readContract({
        address: poolManager,
        abi: POOL_MANAGER_ABI,
        functionName: 'getLiquidity',
        args: [poolId as `0x${string}`],
      });

      // Ensure we have a valid bigint
      if (typeof liquidityResult === 'bigint') {
        return liquidityResult;
      } else if (liquidityResult !== null && liquidityResult !== undefined) {
        // Try to convert to bigint if it's another type
        return BigInt(String(liquidityResult));
      } else {
        throw new Error('Invalid liquidity result');
      }
    } catch (error) {
      console.error(`Error fetching pool liquidity for ${poolId} on ${chainName}:`, error);
      return null;
    }
  }

  /**
   * Get current pool price from slot0
   *
   * @param client Blockchain client
   * @param chainName Chain name
   * @param poolId Pool identifier
   * @returns Square root price as bigint or null on error
   */
  public async getPoolPrice(
    client: PublicClient,
    chainName: string,
    poolId: string
  ): Promise<bigint | null> {
    try {
      const poolManager = UNISWAP_V4_CONTRACTS[chainName]?.poolManager as Address;

      const slot0Result = await client.readContract({
        address: poolManager,
        abi: POOL_MANAGER_ABI,
        functionName: 'getSlot0',
        args: [poolId as `0x${string}`],
      });

      // Ensure we have a valid slot0 result
      if (Array.isArray(slot0Result) && slot0Result.length > 0) {
        const priceValue = slot0Result[0];
        if (typeof priceValue === 'bigint') {
          return priceValue;
        } else {
          return BigInt(String(priceValue));
        }
      } else {
        throw new Error('Invalid slot0 result');
      }
    } catch (error) {
      console.error(`Error fetching pool price for ${poolId} on ${chainName}:`, error);
      return null;
    }
  }
}
