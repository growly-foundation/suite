import { rpc } from '..';
import {
  AlchemyAdapter,
  CoinMarketcapAdapter,
  DexScreenerAdapter,
  EvmscanAdapter,
  ReservoirAdapter,
  UniswapSdkAdapter,
} from '../src/adapters';
import { EvmTokenPlugin } from '../src/plugins/evm';
import { alchemy } from '../src/rpc';
import type { TChainName } from '../src/types';
import { buildEvmChains } from '../src/utils';

export const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || '';

export const COINMARKETCAP_API_BASE_URL = 'https://pro-api.coinmarketcap.com';
export const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY || '';

export const ETHERSCAN_BASE_URL = 'https://api.etherscan.io/v2/api';
export const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY || '';

export const RESERVOIR_API_KEY = process.env.RESERVOIR_API_KEY || '';

export const AdapterRegistry = {
  Alchemy: new AlchemyAdapter(ALCHEMY_API_KEY, new EvmTokenPlugin()),
  CoinMarketcap: new CoinMarketcapAdapter(COINMARKETCAP_API_BASE_URL, COINMARKETCAP_API_KEY),
  Uniswap: new UniswapSdkAdapter(rpc.alchemy(ALCHEMY_API_KEY)),
  Evmscan: new EvmscanAdapter(ETHERSCAN_BASE_URL, ETHERSCAN_API_KEY),
  DexScreener: new DexScreenerAdapter(),
  Reservoir: new ReservoirAdapter(RESERVOIR_API_KEY),
};

export function buildDefaultChains(chainNames: TChainName[]) {
  return buildEvmChains(chainNames, alchemy(ALCHEMY_API_KEY));
}
