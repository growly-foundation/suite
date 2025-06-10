import { initChainsmithSdk } from '..';
import { Wallets } from '../src/data';
import type { TAddress, TMarketTokenList, TMultichain } from '../src/types';
import { AdapterRegistry, buildDefaultChains } from './config';
import * as OnchainBusterTestSuite from './onchain-buster';
import * as ZerionPortfolioTestSuite from './zerion-portfolio';

const chains = buildDefaultChains(['base', 'mainnet', 'optimism']);
const sdk = initChainsmithSdk(chains);

function testExternalities(enabled: boolean, f: () => Promise<any>) {
  if (enabled) f().then(console.log);
}

async function testFetchMultichainTokenList() {
  const wallets: Record<TAddress, TMultichain<TMarketTokenList>> = {};
  for (const wallet of [Wallets.ETH_MAINNET_WALLET_PCMINH]) {
    wallets[wallet] = await sdk.portfolio.getMultichainMarketTokenList([
      AdapterRegistry.CoinMarketcap,
      AdapterRegistry.Alchemy,
    ])(wallet);
  }
  return wallets;
}

async function testFetchEvmscanTokenActivities() {
  sdk.storage.writeToRam('walletAddress', Wallets.ETH_MAINNET_WALLET_PCMINH);
  return sdk.token.listMultichainTokenTransferActivities(AdapterRegistry.Evmscan)();
}

async function testFetchDexScreenerParis() {
  return AdapterRegistry.DexScreener.fetchDexScreenerData(
    '0xBAa5CC21fd487B8Fcc2F632f3F4E8D37262a0842'
  );
}

async function testFetchMultichainTokenPortfolio() {
  return sdk.portfolio.getMultichainTokenPortfolio([
    AdapterRegistry.CoinMarketcap,
    AdapterRegistry.Alchemy,
  ])(Wallets.ETH_MAINNET_WALLET_JESSE);
}

async function testFetchChainlistMetadata() {
  return sdk.evmChain.getAllChainMetadata();
}

testExternalities(false, testFetchMultichainTokenList);
testExternalities(false, testFetchEvmscanTokenActivities);
testExternalities(false, testFetchDexScreenerParis);
testExternalities(false, testFetchMultichainTokenPortfolio);
testExternalities(false, testFetchChainlistMetadata);
// Onchain Buster tests
testExternalities(false, OnchainBusterTestSuite.testCalculateEvmTxStats);
testExternalities(false, OnchainBusterTestSuite.testCalculateNftActivityStats);
testExternalities(false, OnchainBusterTestSuite.testCalculatePortfolioStats);
testExternalities(false, OnchainBusterTestSuite.testFetchNftTransferActivities);
testExternalities(false, OnchainBusterTestSuite.testFetchTokenPortfolio);
testExternalities(false, OnchainBusterTestSuite.testFetchTokenTransferActivities);
testExternalities(false, OnchainBusterTestSuite.testFindLongestHoldingToken);

// Zerion Portfolio tests
testExternalities(true, ZerionPortfolioTestSuite.testFetchZerionTokenPortfolio);
testExternalities(true, ZerionPortfolioTestSuite.testFetchZerionNftPortfolio);
