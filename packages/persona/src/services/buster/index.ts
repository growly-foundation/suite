import {
  TActivityStats,
  TAddress,
  TChainName,
  TChainStats,
  TLongestHoldingToken,
  TMultichain,
  TNFTActivityStats,
  TNftTransferActivity,
  TTokenTransferActivity,
} from '@getgrowly/chainsmith/types';
import {
  calculateEVMStreaksAndMetrics,
  calculateGasInETH,
  calculateNFTActivityStats,
  findLongestHoldingToken,
} from '@getgrowly/chainsmith/utils';

import { EvmChainService } from '../evm';

export class OnchainBusterService {
  constructor(private evmChainService: EvmChainService) {}

  fetchActivityStats = async (
    addressInput: TAddress,
    chains: TChainName[]
  ): Promise<{
    longestHoldingTokenByChain: TLongestHoldingToken[];
    multichainTxs: TMultichain<TTokenTransferActivity[]>;
    chainStats: TChainStats;
    totalGasInETH: number;
    activityStats: TMultichain<TActivityStats>;
  }> => {
    const multichainTxs = await this.evmChainService.listMultichainTokenTransferActivities(
      addressInput,
      chains
    );

    const totalChains: TChainName[] = Object.keys(multichainTxs) as TChainName[];
    const filteredTransactions = Object.values(multichainTxs)
      .flat()
      .filter(tx => tx.from.toLowerCase() === addressInput.toLowerCase());
    const totalGasInETH = filteredTransactions.reduce(
      (acc, curr) =>
        acc + calculateGasInETH(Number.parseInt(curr.gasUsed), Number.parseInt(curr.gasPrice)),
      0
    );

    const longestHoldingTokenByChain = Object.entries(multichainTxs).map(([chain, activities]) => {
      return findLongestHoldingToken(chain as TChainName, activities, addressInput);
    });

    let mostActiveChainName: TChainName = totalChains.reduce((a, b) =>
      (multichainTxs[a]?.length || 0) > (multichainTxs[b]?.length || 0) ? a : b
    );

    // Default chain should be 'Base'
    if (multichainTxs[mostActiveChainName]?.length === 0) mostActiveChainName = 'base';

    const _countActiveChainTxs = multichainTxs[mostActiveChainName]?.length || 0;

    // Get Activity Stats
    const activityStats: TMultichain<TActivityStats> = {};
    for (const chain of totalChains) {
      const chainTxs = multichainTxs[chain];
      if (chainTxs?.length || 0 > 0) {
        activityStats[chain] = calculateEVMStreaksAndMetrics(chainTxs || [], addressInput);
      }
    }

    // Get chain stats
    const noActivityChains = totalChains.filter(chain => multichainTxs[chain]?.length || 0 === 0);
    // Get unique active day, on most active chain 🫠
    const { uniqueActiveDays } = calculateEVMStreaksAndMetrics(
      multichainTxs[mostActiveChainName] || [],
      addressInput
    );

    const chainStats: TChainStats = {
      totalChains,
      mostActiveChainName,
      noActivityChains,
      countUniqueDaysActiveChain: uniqueActiveDays,
      countActiveChainTxs: _countActiveChainTxs,
    };
    return {
      longestHoldingTokenByChain,
      multichainTxs,
      chainStats,
      totalGasInETH,
      activityStats,
    };
  };

  fetchMultichainNftActivity = async (
    addressInput: TAddress,
    chains: TChainName[]
  ): Promise<{
    allNftActivities: TNftTransferActivity[];
    nftActivityStats: TNFTActivityStats;
  }> => {
    const nftActivityData = await this.evmChainService.listMultichainNftTransferActivities(
      addressInput,
      chains
    );
    const allNftActivities = Object.values(nftActivityData).flat();
    return {
      allNftActivities,
      nftActivityStats: calculateNFTActivityStats(allNftActivities, addressInput),
    };
  };
}
