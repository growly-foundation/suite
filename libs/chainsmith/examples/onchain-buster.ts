import 'reflect-metadata';

import { initChainsmithSdk } from '..';
import { Wallets } from '../src/data';
import type {
  TActivityStats,
  TChainName,
  TMultichain,
  TNftTransferActivity,
  TTokenPortfolio,
  TTokenTransferActivity,
} from '../src/types';
import {
  calculateEVMStreaksAndMetrics,
  calculateMultichainTokenPortfolio,
  calculateNFTActivityStats,
  findLongestHoldingToken,
} from '../src/utils';
import { AdapterRegistry, buildDefaultChains } from './config';

async function testFetchTokenTransferActivities(): Promise<TMultichain<TTokenTransferActivity[]>> {
  const chains = buildDefaultChains(['mainnet']);
  const sdk = initChainsmithSdk(chains);
  const wallet = Wallets.ETH_MAINNET_WALLET_PCMINH;

  return await sdk.token.listMultichainTokenTransferActivities(AdapterRegistry.Evmscan)(wallet);
}

async function testFetchNftTransferActivities(): Promise<TMultichain<TNftTransferActivity[]>> {
  const chains = buildDefaultChains(['mainnet']);
  const sdk = initChainsmithSdk(chains);
  const wallet = Wallets.ETH_MAINNET_WALLET_PCMINH;

  return await sdk.token.listMultichainNftTransferActivities(AdapterRegistry.Evmscan)(wallet);
}

async function testFetchTokenPortfolio(): Promise<TTokenPortfolio> {
  const chains = buildDefaultChains(['mainnet']);
  const sdk = initChainsmithSdk(chains);
  const wallet = Wallets.ETH_MAINNET_WALLET_PCMINH;

  return await sdk.portfolio.getMultichainTokenPortfolio([
    AdapterRegistry.CoinMarketcap,
    AdapterRegistry.Alchemy,
  ])(wallet);
}

async function testCalculatePortfolioStats(): Promise<TTokenPortfolio> {
  const tokenPortfolio = await testFetchTokenPortfolio();
  return calculateMultichainTokenPortfolio(tokenPortfolio);
}

async function testCalculateEvmTxStats(): Promise<TActivityStats> {
  const tokenActivities = await testFetchTokenTransferActivities();
  const wallet = Wallets.ETH_MAINNET_WALLET_PCMINH;

  return calculateEVMStreaksAndMetrics(tokenActivities['base'] || [], wallet);
}

async function testFindLongestHoldingToken() {
  const tokenActivities = await testFetchTokenTransferActivities();
  const wallet = Wallets.ETH_MAINNET_WALLET_PCMINH;

  return Object.entries(tokenActivities).map(([chain, activities]) => {
    return findLongestHoldingToken(chain as TChainName, activities, wallet);
  });
}

async function testCalculateNftActivityStats() {
  const nftActivities = await testFetchNftTransferActivities();
  const wallet = Wallets.ETH_MAINNET_WALLET_PCMINH;

  return calculateNFTActivityStats(
    Object.values(nftActivities).flat() as TNftTransferActivity[],
    wallet
  );
}

export {
  testCalculateEvmTxStats,
  testCalculateNftActivityStats,
  testCalculatePortfolioStats,
  testFetchNftTransferActivities,
  testFetchTokenPortfolio,
  testFetchTokenTransferActivities,
  testFindLongestHoldingToken,
};
