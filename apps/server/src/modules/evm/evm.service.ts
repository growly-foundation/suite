import { Injectable } from '@nestjs/common';
import {
  TAddress,
  TChainName,
  TMultichain,
  TNftBalance,
  TTokenPortfolio,
  TTokenTransferActivity,
} from 'chainsmith-sdk/types';
import { AdapterRegistry, chainsmithSdk } from '../../config';

@Injectable()
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
