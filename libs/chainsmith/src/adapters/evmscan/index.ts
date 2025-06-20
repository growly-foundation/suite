import axios from 'axios';
import { Logger } from 'tslog';

import type {
  IOnchainActivityAdapter,
  TAddress,
  TChainName,
  TNftTransferActivity,
  TTokenTransferActivity,
} from '../../types';
import { getChainByName, getChainIdByName, objectToQueryString } from '../../utils';
import type { TEVMScanResponse, TEVMScanTokenActivity, TEVMScanTransaction } from './types';

export type * from './types';

interface GetTokenActivityQueryOptions {
  page: number;
  offset: number;
  endblock: number;
  startblock: number;
  sort: 'asc' | 'desc';
}

const MAX_CALLS = 5;

export class EvmscanAdapter implements IOnchainActivityAdapter {
  name = 'EvmscanAdapter';
  logger = new Logger({ name: this.name });

  apiUrl: string;
  apiKey: string;

  constructor(apiUrl: string, apiKey: string) {
    this.apiUrl = apiUrl;
    this.apiKey = apiKey;
  }

  async listAllTransactions(
    chainName: TChainName,
    address: TAddress
  ): Promise<TEVMScanTransaction[]> {
    const chainId = getChainIdByName(chainName);
    const action = 'txlist';

    const query = `chainid=${chainId}&module=account&action=${action}&address=${address}&apikey=${this.apiKey}`;
    let attempts = 0;
    while (attempts < 3) {
      try {
        const res = await axios.get<TEVMScanResponse>(`${this.apiUrl}?${query}`, {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'PostmanRuntime/7.40.0',
          },
        });

        if (res?.status === 200) {
          return res.data.result as TEVMScanTransaction[];
        }
        attempts++;
      } catch (error) {
        console.error(`Fetch attempt ${attempts} failed:`, error);
        attempts++;
      }
    }
    return [];
  }

  async listAllTokenActivities(
    chainName: TChainName,
    address: TAddress,
    limit: number
  ): Promise<TTokenTransferActivity[]> {
    if (address.length === 0) return [];

    const chain = getChainByName(chainName);
    let tokenActivities: TEVMScanTokenActivity[] = [];

    let calls = 0;
    let offset = 0;
    let previousResultCount = 0;

    while (true) {
      this.logger.debug(
        `Fetching token activities for ${address} on ${chainName} [${calls}/${MAX_CALLS}]...`
      );
      if (calls >= MAX_CALLS) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        calls = 0;
      }
      const evmScanResp = await this.getTokenActivities('tokentx', address, chain.id, {
        offset,
      });
      offset += limit;
      calls++;

      if (!evmScanResp.result.filter) {
        this.logger.error('Failed to get token activities', evmScanResp.result);
        throw new Error(`Failed to get token activities: ${evmScanResp.result}`);
      }
      const currentResultCount = evmScanResp.result.length;

      tokenActivities = tokenActivities.concat(evmScanResp.result as TEVMScanTokenActivity[]);

      if (currentResultCount === 0 || currentResultCount === previousResultCount) break;
      previousResultCount = currentResultCount;
    }

    return tokenActivities.map(t => {
      return {
        ...t,
        chainId: chain.id,
        symbol: t.tokenSymbol,
        from: t.from as TAddress,
        to: t.to as TAddress,
        value: t.value || 0,
        timestamp: t.timeStamp,
        tokenDecimal: t.tokenDecimal || '18',
      };
    });
  }

  async listAllNftActivities(
    chainName: TChainName,
    address: TAddress,
    limit: number
  ): Promise<TNftTransferActivity[]> {
    if (address.length === 0) return [];

    const chain = getChainByName(chainName);
    let nftActivities: TEVMScanTokenActivity[] = [];

    let calls = 0;
    let offset = 0;
    let previousResultCount = 0;

    while (true) {
      this.logger.debug(
        `Fetching nft activities for ${address} on ${chainName} [${calls}/${MAX_CALLS}]...`
      );
      if (calls >= MAX_CALLS) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        calls = 0;
      }
      const evmScanResp = await this.getTokenActivities('tokennfttx', address, chain.id, {
        offset,
      });
      offset += limit;
      calls++;

      if (!evmScanResp.result.filter) {
        this.logger.error('Failed to get token activities', evmScanResp.result);
        throw new Error(`Failed to get token activities: ${evmScanResp.result}`);
      }
      const currentResultCount = evmScanResp.result.length;

      nftActivities = nftActivities.concat(evmScanResp.result as TEVMScanTokenActivity[]);

      if (currentResultCount === 0 || currentResultCount === previousResultCount) break;
      previousResultCount = currentResultCount;
    }

    return nftActivities.map(t => {
      return {
        ...t,
        chainId: chain.id,
        blockHash: t.blockHash,
        hash: t.hash,
        from: t.from as TAddress,
        to: t.to as TAddress,
        timestamp: t.timeStamp,

        tokenID: t.tokenID || '',
        tokenName: t.tokenName,
        tokenSymbol: t.tokenSymbol,
      };
    });
  }

  async getTokenActivities(
    action: string,
    address: string,
    chainId: number,
    queryOptions: Partial<GetTokenActivityQueryOptions> = {
      offset: 0,
      startblock: 0,
      endblock: 99999999,
      sort: 'desc',
    }
  ): Promise<TEVMScanResponse> {
    const params = objectToQueryString(queryOptions);
    const query = `chainid=${chainId}&module=account&action=${action}&address=${address}&${params}&apikey=${this.apiKey}`;
    const res = await axios.get(`${this.apiUrl}?${query}`, {
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'PostmanRuntime/7.40.0',
      },
    });
    const result = await res.data;
    return result;
  }
}
