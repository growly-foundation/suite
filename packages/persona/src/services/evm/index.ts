import {
  TAddress,
  TChainName,
  TMultichain,
  TNftBalance,
  TNftTransferActivity,
  TTokenPortfolio,
  TTokenTransferActivity,
} from '@getgrowly/chainsmith/types';

import { AdapterRegistry, chainsmithSdk } from '../../config/chainsmith';

export class EvmChainService {
  async getWalletTokenPortfolio(
    walletAddress: TAddress,
    chainNames: TChainName[]
  ): Promise<TTokenPortfolio> {
    const sdk = chainsmithSdk(chainNames);
    return sdk.portfolio.getMultichainTokenPortfolio([
      AdapterRegistry.CoinMarketcap,
      AdapterRegistry.Alchemy,
    ])(walletAddress, sdk.storage.readDisk('chains'));
  }

  async listMultichainTokenTransferActivities(
    walletAddress: TAddress,
    chainNames: TChainName[]
  ): Promise<TMultichain<TTokenTransferActivity[]>> {
    return chainsmithSdk(chainNames).token.listMultichainTokenTransferActivities(
      AdapterRegistry.Evmscan
    )(walletAddress);
  }

  async listMultichainNftTransferActivities(
    walletAddress: TAddress,
    chainNames: TChainName[]
  ): Promise<TMultichain<TNftTransferActivity[]>> {
    return chainsmithSdk(chainNames).token.listMultichainNftTransferActivities(
      AdapterRegistry.Evmscan
    )(walletAddress);
  }

  async getMultichainNftCollectibles(
    walletAddress: TAddress,
    chainNames: TChainName[]
  ): Promise<TMultichain<TNftBalance[]>> {
    const result: TMultichain<TNftBalance[]> = {};
    const sdk = chainsmithSdk(chainNames);
    for (const chainName of chainNames) {
      result[chainName] = await sdk.token.getNftCollectibles(AdapterRegistry.Reservoir)(
        chainName,
        walletAddress
      );
    }
    return result;
  }
}
