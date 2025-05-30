# Chainsmith SDK [WIP]

Viem-compatible abstraction library to simplify the interaction with multiple blockchains via user-friendly high level APIs.

[![npm](https://img.shields.io/npm/v/@getgrowly/chainsmith)](https://www.npmjs.com/package/@getgrowly/chainsmith)
[![License](https://img.shields.io/npm/l/@@getgrowly/chainsmith)](LICENSE)

## Current features of the SDK

- Support all chains listed in Viem library.
- Customizable plugins and adapters.
- Core plugins to query onchain portfolio, token metadata, token prices...
- Chain configuration with modifiable RPC URL settings.
- Plug-n-play different adapters to plugins depend on the use cases.

## Getting Started

Install the dependency

```
npm install @getgrowly/chainsmith
```

## Supported Adapters

| Name                 | Chain      | Interfaces              |
| -------------------- | ---------- | ----------------------- |
| CoinMarketcapAdapter | Multichain | IMarketDataAdapter      |
| AlchemyAdapter       | Multichain | IOnchainTokenAdapter    |
| ReservoirAdapter     | Multichain | IOnchainNftAdapter      |
| UniswapSdkAdapter    | EVM chains | IMarketDataAdapter      |
| EvmscanAdapter       | EVM chains | IOnchainActivityAdapter |

## Initializing the SDK with Shared RPC Providers

The following example demonstrates how to initialize the SDK using Alchemy as the primary RPC provider for all registered chains.

```typescript
import { initChainsmithSdk } from '@getgrowly/chainsmith';
import { alchemy } from '@getgrowly/chainsmith/rpc';
import { buildEvmChains } from '@getgrowly/chainsmith/utils';

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY || '';

// Helper method to build all EVM chains with Alchemy as the RPC provider.
export function buildDefaultChains(chainNames: TChainName[]) {
  return buildEvmChains(chainNames, alchemy(ALCHEMY_API_KEY));
}

// Build Base, Mainnet, and Optimism chains.
const chains = buildDefaultChains(['mainnet', 'base', 'optimism']);

// Initialize the Chainsmith SDK.
const sdk = initChainsmithSdk(chains);
```

The `alchemy` function is a built-in RPC endpoint provider in the SDK. If you need to customize the method, refer to the `alchemy` example in the SDK source code.

## Initializing the SDK with Custom RPC Endpoints

If you want to use a custom RPC provider for a specific chain (e.g., Base chain), use `buildChainsWithCustomRpcUrls` to map `TChainName` to a custom RPC URL:

```typescript
const chains = buildChainsWithCustomRpcUrls(
  { base: 'https://base.blockpi.network/v1/rpc/public' },
  'evm'
);
```

## Using Plugins to Fetch a Multichain Portfolio

The example below fetches a multichain token portfolio using CoinMarketcap as the market data source and Alchemy for on-chain token activities.

```typescript
const portfolio = await sdk.portfolio.getMultichainTokenPortfolio([
  AdapterRegistry.CoinMarketcap,
  AdapterRegistry.Alchemy,
])(Wallets.ETH_MAINNET_WALLET_JESSE);
```

### Adapter Order Requirement

The order of the adapters in the plugin API must match the required interface order:

```typescript
getMultichainTokenPortfolio: WithManyAdapters<
  [IMarketDataAdapter, IOnchainTokenAdapter],
  IGetMultichainTokenPortfolio
>;
```

## Using Multiple Adapters as Fallback Data Providers

In cases where multiple data sources are required for fallback, the SDK provides extended adapters for advanced use cases.

### `multiple` Adapter

The `multiple` function allows using two different market data adapters as fallback providers. The first adapter is prioritized, and if it fails to fetch the required data, the second adapter is used.

#### Example: Fetch Token Portfolio Using Two Market Data Adapters

In the example below, `CoinMarketcap` is prioritized for fetching token price data. If no data is found, `UniswapSdk` is used as a fallback.

```typescript
const portfolio = await sdk.portfolio.getChainTokenPortfolio([
  multiple([AdapterRegistry.CoinMarketcap, AdapterRegistry.UniswapSdk]),
  AdapterRegistry.CoinMarketcap,
])(Wallets.ETH_MAINNET_WALLET_JESSE);
```

This approach ensures better reliability by using decentralized exchange (DEX) price data first and falling back to centralized market data if needed.
