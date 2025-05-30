import { getZerionAxiosInstance } from '@/tools/zerion/rpc';
import { ZerionFungiblePositionsResponse } from '@/tools/zerion/types';
import { formatPositionsData } from '@/tools/zerion/utils';
import { ToolFn, ToolOutputValue } from '@/utils/tools';
import { isAddress } from 'viem';

export const getFungiblesPositionsToolFn: ToolFn =
  () =>
  async ({ walletAddress }: { walletAddress: string }): Promise<ToolOutputValue[]> => {
    if (!isAddress(walletAddress)) {
      return [
        {
          type: 'text',
          content: `Invalid wallet address: ${walletAddress}`,
        },
      ];
    }
    try {
      const response = await getZerionAxiosInstance().get<ZerionFungiblePositionsResponse>(
        `/wallets/${walletAddress}/positions?filter[positions]=no_filter&currency=usd&filter[trash]=only_non_trash&sort=value`
      );
      const { data } = response.data;
      return [
        {
          type: 'text',
          content: formatPositionsData(data),
        },
      ];
    } catch (error: any) {
      return [
        {
          type: 'system:error',
          content: `Failed to fetch token holdings data: ${error.message}`,
        },
      ];
    }
  };
