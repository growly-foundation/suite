import { isAddress } from 'viem';

import { ToolFn, ToolOutputValue } from '../../../../utils/tools';
import { getZerionAxiosInstance } from '../../rpc';
import { ZerionPortfolioResponse } from '../../types';
import { formatPortfolioData } from '../../utils';

export const getPortfolioOverviewToolFn: ToolFn =
  () =>
  async ({ walletAddress }): Promise<ToolOutputValue[]> => {
    if (!isAddress(walletAddress)) {
      return [
        {
          type: 'text',
          content: `Invalid wallet address: ${walletAddress}`,
        },
      ];
    }
    try {
      const response = await getZerionAxiosInstance().get<ZerionPortfolioResponse>(
        `/wallets/${walletAddress}/portfolio?filter[positions]=no_filter&currency=usd`
      );
      const { data } = response.data;
      return [
        {
          type: 'text',
          content: formatPortfolioData(data),
        },
      ];
    } catch (error: any) {
      return [
        {
          type: 'system:error',
          content: `Failed to fetch portfolio: ${error.message}`,
        },
      ];
    }
  };
