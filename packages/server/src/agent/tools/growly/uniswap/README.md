# Growly Uniswap Tools

This directory contains a collection of tools for interacting with Uniswap and providing crypto portfolio management functionality.

## Tools Overview

### 1. Portfolio Analyzer (`portfolio-analyzer.ts`)

Analyzes a user's crypto portfolio and provides risk assessment and diversification recommendations.

### 2. Portfolio Rebalancer (`rebalance.ts`)

Analyzes a user's portfolio and suggests how to rebalance it for better risk management or performance using Uniswap swaps.

### 3. Liquidity Provider (`liquidity-provider.ts`)

Suggests optimal token pairs for providing liquidity on Uniswap based on a user's portfolio.

### 4. Suggest Swap (`suggest-swap.ts`)

Generates a pre-filled Uniswap swap link for exchanging one token for another, without requiring portfolio analysis.

## Utility Modules

### Token List Manager (`token-list.ts`)

Manages token lists from multiple sources (Superchain, Uniswap) and provides token address lookups.

### Pool Data Fetcher (`pool-data-fetcher.ts`)

Fetches Uniswap pool data for token pairs to provide APR and risk assessments.

### Swap Utilities (`swap-utils.ts`)

Shared utilities for generating swap recommendations and Uniswap links, used by multiple tools.

## Using the Suggest Swap Tool

The `suggest_swap` tool allows creating direct Uniswap swap links without requiring portfolio analysis. This is useful for:

- Creating swap links for specific token pairs
- Generating swap recommendations for tokens not in the user's portfolio
- Quick access to Uniswap functionality without portfolio analysis

### Example Usage

```typescript
const swapRecommendation = await suggestSwapTool.invoke({
  fromToken: 'ETH',
  toToken: 'USDC',
  amount: 100, // USD value
  chain: 'base',
  reason: 'Converting ETH to stablecoins for reduced volatility',
});
```

The tool will:

1. Look up token addresses using the TokenListManager
2. Generate a pre-filled Uniswap swap link with the correct parameters
3. Return a formatted recommendation with the link

## Architecture

The tools are designed with a modular architecture:

1. Each tool is implemented as a standalone module
2. Common functionality is extracted to shared utility modules
3. Token address resolution is centralized in the TokenListManager
4. Swap link generation is centralized in swap-utils.ts

This design allows for:

- Code reuse across tools
- Consistent token address resolution
- Unified swap link generation format

## Hardcoded Token Addresses

For reliability and consistency, certain token addresses are hardcoded:

- **USDC on Base**: `0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`

These hardcoded addresses take precedence over addresses from token lists and are implemented in:

- `swap-utils.ts` via the `HARDCODED_ADDRESSES` constant
- `token-list.ts` in the `getTokenAddress` method

This ensures that critical tokens always use the correct contract address regardless of what's returned from token list sources.

```

```
