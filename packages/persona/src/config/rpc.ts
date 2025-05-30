import { Chains } from '@getgrowly/chainsmith/data';
import { GetChainRpcEndpoint } from '@getgrowly/chainsmith/rpc';
import { getChainDefaultRpcUrl } from '@getgrowly/chainsmith/utils';

function alchemyRpcUrl(chainId: string) {
  return `https://${chainId}.g.alchemy.com`;
}

const ALCHEMY_CHAIN_ENDPOINT = {
  [Chains.EvmChainList.mainnet.id]: alchemyRpcUrl('eth-mainnet'),
  [Chains.EvmChainList.base.id]: alchemyRpcUrl('base-mainnet'),
};

export const alchemy: (apiKey: string) => GetChainRpcEndpoint = (apiKey: string) => chain => {
  const endpoint = (ALCHEMY_CHAIN_ENDPOINT as any)[chain.id];
  if (!endpoint) return getChainDefaultRpcUrl(chain) || '';
  return `${endpoint}/v2/${apiKey}`;
};
