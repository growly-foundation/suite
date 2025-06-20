import { ChainsmithSdk, initChainsmithSdk } from '@getgrowly/chainsmith';
import { AlchemyAdapter, EvmscanAdapter } from '@getgrowly/chainsmith/adapters';
import { EvmTokenPlugin, ZerionPortfolioPlugin } from '@getgrowly/chainsmith/plugins';
import { alchemy } from '@getgrowly/chainsmith/rpc';
import { TChain, TChainName } from '@getgrowly/chainsmith/types';
import { buildEvmChains } from '@getgrowly/chainsmith/utils';

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || '';
const ETHERSCAN_BASE_URL = 'https://api.etherscan.io/v2/api';
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';

const ZERION_API_KEY = process.env.ZERION_API_KEY || '';
const ZERION_API_BASE_URL = 'https://api.zerion.io/v1';

export const AdapterRegistry = {
  Alchemy: new AlchemyAdapter(ALCHEMY_API_KEY, new EvmTokenPlugin()),
  Evmscan: new EvmscanAdapter(ETHERSCAN_BASE_URL, ETHERSCAN_API_KEY),
};

export const zerionPortfolioPlugin = new ZerionPortfolioPlugin(ZERION_API_BASE_URL, ZERION_API_KEY);

export const buildDefaultChains = (chainNames: TChainName[]): TChain[] =>
  buildEvmChains(chainNames, alchemy(ALCHEMY_API_KEY));

export const chainsmithSdk = (chainNames: TChainName[] = []): ChainsmithSdk => {
  let chains: TChain[] = [];
  if (chainNames.length > 0) {
    chains = buildDefaultChains(chainNames);
  }
  return initChainsmithSdk(chains);
};
