import { Logger } from 'tslog';

import { EvmTokenPlugin } from '..';
import type {
  IMarketDataAdapter,
  IOnchainActivityAdapter,
  IOnchainNftAdapter,
  IOnchainTokenAdapter,
  TAddress,
  TChain,
  TChainName,
  TClient,
  TContractToken,
  TMarketToken,
  TMultichain,
  TNativeToken,
  TNftCollectionBalance,
  TNftTransferActivity,
  TToken,
  TTokenAddress,
  TTokenTransferActivity,
  WithAdapter,
} from '../../types';
import { getClientChain } from '../../utils';
import { createClient, formatReadableToken } from '../../wrapper';
import { StoragePlugin } from '../storage';

type TGetMultichainTokenActivities = (
  address?: TAddress,
  chains?: TChain[]
) => Promise<TMultichain<TTokenTransferActivity[]>>;

type TGetChainTokenActivities = (
  address?: TAddress,
  chain?: TChain
) => Promise<TTokenTransferActivity[]>;

type TGetMultichainNftActivities = (
  address?: TAddress,
  chains?: TChain[]
) => Promise<TMultichain<TNftTransferActivity[]>>;

type TGetChainNftActivities = (
  address?: TAddress,
  chain?: TChain
) => Promise<TNftTransferActivity[]>;

type TGetMultichainOwnedTokens = (
  address?: TAddress,
  chains?: TChain[]
) => Promise<TMultichain<TContractToken[]>>;

type TGetChainOwnedTokens = (address?: TAddress, chain?: TChain) => Promise<TContractToken[]>;

type TGetTokenPrice = (
  client?: TClient,
  tokenAddress?: TTokenAddress
) => Promise<TMarketToken | undefined>;

type TGetOwnedTokens = (chain: TChain, walletAddress?: TAddress) => Promise<TContractToken[]>;

type TGetTokens = (chain?: TChain, walletAddress?: TAddress) => Promise<TToken[]>;

type IGetNftCollections = (
  chainName?: TChainName,
  walletAddress?: TAddress
) => Promise<TNftCollectionBalance[]>;

export class MultichainTokenPlugin {
  logger = new Logger({ name: 'MultichainTokenPlugin' });

  evmPlugin: EvmTokenPlugin = new EvmTokenPlugin();

  storagePlugin: StoragePlugin<{
    client: TClient;
    walletAddress: TAddress;
    tokenAddress: TAddress;
  }> = new StoragePlugin();

  getTokenPrice: WithAdapter<IMarketDataAdapter, TGetTokenPrice> =
    adapter => async (client?: TClient, tokenAddress?: TAddress) => {
      try {
        const chain = getClientChain(this.storagePlugin.readRamOrReturn({ client }));
        return adapter.fetchTokenWithPrice(chain.chainName!, {
          address: this.storagePlugin.readRamOrReturn({ tokenAddress }),
        } as TToken);
      } catch (error: any) {
        this.logger.error(`Failed to get token price: ${error.message}`);
        throw new Error(error);
      }
    };

  listMultichainOwnedTokens: WithAdapter<IOnchainTokenAdapter, TGetMultichainOwnedTokens> =
    adapter => async (walletAddress?: TAddress, chains?: TChain[]) => {
      try {
        const multichainTokens: TMultichain<TContractToken[]> = {};
        for (const chain of this.storagePlugin.readDiskOrReturn({ chains })) {
          multichainTokens[chain.chainName] = await adapter.listAllOwnedTokens(
            chain,
            this.storagePlugin.readRamOrReturn({ walletAddress })
          );
        }
        return multichainTokens;
      } catch (error: any) {
        this.logger.error(`Failed to get multichain tokens: ${error.message}`);
        throw new Error(error);
      }
    };

  listChainOwnedTokens: WithAdapter<IOnchainTokenAdapter, TGetChainOwnedTokens> =
    adapter => async (walletAddress?: TAddress, chain?: TChain) => {
      try {
        const _chain = chain || this.storagePlugin.readDisk('chains')[0];
        if (!_chain) throw new Error('No chain provided');
        return adapter.listAllOwnedTokens(
          _chain,
          this.storagePlugin.readRamOrReturn({ walletAddress })
        );
      } catch (error: any) {
        this.logger.error(`Failed to get multichain tokens: ${error.message}`);
        throw new Error(error);
      }
    };

  listMultichainTokenTransferActivities: WithAdapter<
    IOnchainActivityAdapter,
    TGetMultichainTokenActivities
  > = adapter => async (walletAddress?: TAddress, chains?: TChain[]) => {
    try {
      const chainActivitiesRecord: TMultichain<TTokenTransferActivity[]> = {};
      for (const chain of this.storagePlugin.readDiskOrReturn({ chains })) {
        chainActivitiesRecord[chain.chainName] = await adapter.listAllTokenActivities(
          chain.chainName,
          this.storagePlugin.readRamOrReturn({ walletAddress }),
          100
        );
      }
      return chainActivitiesRecord;
    } catch (error: any) {
      this.logger.error(`Failed to get token activities: ${error.message}`);
      throw new Error(error);
    }
  };

  listChainTokenTransferActivities: WithAdapter<IOnchainActivityAdapter, TGetChainTokenActivities> =
    adapter => async (walletAddress?: TAddress, chain?: TChain) => {
      try {
        const _chain = chain || this.storagePlugin.readDisk('chains')[0];
        if (!_chain) throw new Error('No chain provided');
        return adapter.listAllTokenActivities(
          _chain.chainName,
          this.storagePlugin.readRamOrReturn({ walletAddress }),
          100
        );
      } catch (error: any) {
        this.logger.error(`Failed to get token activities: ${error.message}`);
        throw new Error(error);
      }
    };

  listMultichainNftTransferActivities: WithAdapter<
    IOnchainActivityAdapter,
    TGetMultichainNftActivities
  > = adapter => async (walletAddress?: TAddress, chains?: TChain[]) => {
    try {
      const chainActivitiesRecord: TMultichain<TNftTransferActivity[]> = {};
      for (const chain of this.storagePlugin.readDiskOrReturn({ chains })) {
        chainActivitiesRecord[chain.chainName] = await adapter.listAllNftActivities(
          chain.chainName,
          this.storagePlugin.readRamOrReturn({ walletAddress }),
          100
        );
      }
      return chainActivitiesRecord;
    } catch (error: any) {
      this.logger.error(`Failed to get NFT activities: ${error.message}`);
      throw new Error(error);
    }
  };

  listChainNftTransferActivities: WithAdapter<IOnchainActivityAdapter, TGetChainNftActivities> =
    adapter => async (walletAddress?: TAddress, chain?: TChain) => {
      try {
        const _chain = chain || this.storagePlugin.readDisk('chains')[0];
        if (!_chain) throw new Error('No chain provided');
        return adapter.listAllNftActivities(
          _chain.chainName,
          this.storagePlugin.readRamOrReturn({ walletAddress }),
          100
        );
      } catch (error: any) {
        this.logger.error(`Failed to get token activities: ${error.message}`);
        throw new Error(error);
      }
    };

  getTokens: WithAdapter<IOnchainTokenAdapter, TGetTokens> =
    adapter => async (chain?: TChain, walletAddress?: TAddress) => {
      try {
        const _chain = chain || this.storagePlugin.readDisk('chains')[0];
        if (!_chain) throw new Error('No chain provided');
        const client = createClient({
          chain: _chain,
        });
        const _walletAddress = this.storagePlugin.readRamOrReturn({ walletAddress });
        const nativeToken = await this.getNativeToken(client, _walletAddress);
        const contractTokens = await this.getContractTokens(adapter)(_chain, _walletAddress);
        return [nativeToken, ...contractTokens];
      } catch (error: any) {
        this.logger.error(`Failed to get tokens: ${error}`);
        throw new Error(error);
      }
    };

  getContractTokens: WithAdapter<IOnchainTokenAdapter, TGetOwnedTokens> =
    adapter => async (chain: TChain, walletAddress?: TAddress) => {
      try {
        const contractTokens = await adapter.listAllOwnedTokens(
          chain,
          this.storagePlugin.readRamOrReturn({ walletAddress })
        );
        return contractTokens;
      } catch (error: any) {
        this.logger.error(`Failed to get contract tokens: ${error.message}`);
        throw new Error(error);
      }
    };

  getNftCollectibles: WithAdapter<IOnchainNftAdapter, IGetNftCollections> =
    adapter => async (chainName?: TChainName, walletAddress?: TAddress) => {
      try {
        const _chainName = chainName || this.storagePlugin.readDisk('chains')[0]?.chainName;
        if (!_chainName) throw new Error('No chain provided');
        const collectibles = await adapter.fetchNFTCollectionBalance(
          _chainName,
          this.storagePlugin.readRamOrReturn({ walletAddress })
        );
        return collectibles;
      } catch (error: any) {
        this.logger.error(`Failed to get collectibles: ${error.message}`);
        throw new Error(error);
      }
    };

  async getNativeToken(client: TClient, walletAddress?: TAddress): Promise<TNativeToken> {
    try {
      const chain = getClientChain(client);
      const metadata = await this.evmPlugin.getTokenMetadataBySymbol(chain.nativeCurrency.symbol);
      const balance = await client.getBalance({
        address: this.storagePlugin.readRamOrReturn({ walletAddress }),
      });
      return {
        ...chain.nativeCurrency,
        logoURI: metadata?.logoURI,
        chainId: chain.id,
        type: 'native',
        balance: formatReadableToken(chain, balance),
      };
    } catch (error: any) {
      this.logger.error(`Failed to get native token: ${error.message}`);
      throw new Error(error);
    }
  }
}
