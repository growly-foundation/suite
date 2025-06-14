import axios from 'axios';
import { Logger } from 'tslog';
import * as EvmChainList from 'viem/chains';

import type { IOnchainNftAdapter, TAddress, TChainName, TNftCollectionBalance } from '../../types';
import { getChainIdByName, objectToQueryString } from '../../utils';
import type { TReservoirNFTCollectionEntity, TReservoirNFTCollectionResponse } from './types';

export type * from './types';

const RESERVOIR_CHAIN_ENDPOINT = {
  [EvmChainList.mainnet.id]: reservoirApiUrl(''),
  [EvmChainList.base.id]: reservoirApiUrl('-base'),
  [EvmChainList.optimism.id]: reservoirApiUrl('-optimism'),
  [EvmChainList.arbitrum.id]: reservoirApiUrl('-arbitrum'),
  [EvmChainList.abstract.id]: reservoirApiUrl('-abstract'),
};

function reservoirApiUrl(chainId: string) {
  return `https://api${chainId}.reservoir.tools`;
}

export class ReservoirAdapter implements IOnchainNftAdapter {
  name = 'ReservoirAdapter';
  logger = new Logger({ name: this.name });

  apiKey: string;

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async fetchNFTCollectionBalance(
    chain: TChainName,
    address: TAddress
  ): Promise<TNftCollectionBalance[]> {
    const userCollections = await this.getUserCollections(address, chain);

    if (!userCollections || !userCollections.length) return [];

    const filteredCollections = userCollections.filter(
      // Try cleaning spam/minor NFT collection
      item =>
        item.collection.image &&
        item.collection.openseaVerificationStatus &&
        item.collection.volume['30day'] !== 0 &&
        item.collection.floorSale['30day'] !== 0 &&
        item.collection.volumeChange['30day'] !== 0
    );

    const nftBalances: TNftCollectionBalance[] = filteredCollections.map(uc => {
      const metadata = uc.collection;
      const ownership = uc.ownership;

      const collectionCurrency = metadata.floorAskPrice?.currency.symbol || 'ETH';
      const collectionPriceNative = metadata.floorAskPrice?.amount.native || 0;
      return {
        chainId: getChainIdByName(chain),
        address: metadata.id,
        name: metadata.name,
        imageUrl: metadata.image,
        bannerUrl: metadata.banner,
        floorPrice: collectionPriceNative,
        currency: collectionCurrency,
        balance: Number.parseInt(ownership.tokenCount),
      } as TNftCollectionBalance;
    });

    return nftBalances;
  }

  async getUserCollections(
    walletAddress: TAddress,
    chain: TChainName,
    limit = 100
  ): Promise<TReservoirNFTCollectionEntity[]> {
    this.logger.info('Fetch NFT balance of:', walletAddress);

    const chainId = getChainIdByName(chain);

    let allCollections: TReservoirNFTCollectionEntity[] = [];
    let offset = 0;

    while (true) {
      try {
        const queryOptions = {
          excludeSpam: true,
          sortBy: 'totalValue',
          limit,
          offset,
        };

        const params = objectToQueryString(queryOptions);

        const reservoirBaseUrl = (RESERVOIR_CHAIN_ENDPOINT as any)[chainId];

        const url = `${reservoirBaseUrl}/users/${walletAddress}/collections/v4?${params}`;
        const res = await axios.get<TReservoirNFTCollectionResponse>(url);
        const result = res.data;

        if (!result || !result.collections) throw new Error('No collections available');

        const newCollections = result.collections;
        allCollections = allCollections.concat(result.collections);
        if (newCollections.length < limit) {
          break; // Last page reached
        }

        offset += limit;
      } catch (error) {
        this.logger.error('Error fetching Reservoir data:', error);
        return [];
      }
    }

    return allCollections;
  }
}
