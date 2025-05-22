import { TokenListManager } from './token-list';
import { RebalanceRecommendation, TokenInfo } from './types';

// Hardcoded token addresses for specific chains
const HARDCODED_ADDRESSES: Record<string, Record<string, string>> = {
  base: {
    USDC: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
  },
};

/**
 * Creates a swap recommendation with token information
 */
export function createSwapRecommendation(
  fromToken: TokenInfo,
  toToken: TokenInfo,
  reason: string,
  valueToSwap: number
): RebalanceRecommendation {
  // Generate Uniswap link
  const chain = fromToken.chain === toToken.chain ? fromToken.chain : 'ethereum';

  // We'll create a placeholder link and then update it asynchronously
  const uniswapLink = `https://app.uniswap.org/swap?chain=${chain}`;

  // Calculate token amount from USD value based on the token price
  const tokenAmount = fromToken.price > 0 ? valueToSwap / fromToken.price : 0;

  return {
    fromToken,
    toToken,
    reason,
    uniswapLink,
    valueToSwap,
    tokenAmount,
  };
}

/**
 * Updates a swap recommendation with token addresses and generates the final Uniswap link
 */
export async function updateSwapWithTokenAddresses(
  recommendation: RebalanceRecommendation,
  tokenListManager: TokenListManager
): Promise<RebalanceRecommendation> {
  const { fromToken, toToken, tokenAmount = 0 } = recommendation;
  const chain = fromToken.chain === toToken.chain ? fromToken.chain : 'ethereum';

  try {
    // Use token addresses from the tokens themselves if available
    let fromAddress = fromToken.address || '';
    let toAddress = toToken.address || '';

    // Check for hardcoded addresses first (highest priority)
    if (HARDCODED_ADDRESSES[chain]?.[fromToken.symbol]) {
      fromAddress = HARDCODED_ADDRESSES[chain][fromToken.symbol];
      console.log(`Using hardcoded address for ${fromToken.symbol} on ${chain}: ${fromAddress}`);
    } else if (!fromAddress) {
      // If not hardcoded and not available in token info, look up from token lists
      fromAddress = await tokenListManager.getTokenAddress(chain, fromToken.symbol);
    }

    // Same for toToken
    if (HARDCODED_ADDRESSES[chain]?.[toToken.symbol]) {
      toAddress = HARDCODED_ADDRESSES[chain][toToken.symbol];
      console.log(`Using hardcoded address for ${toToken.symbol} on ${chain}: ${toAddress}`);
    } else if (!toAddress) {
      // If not hardcoded and not available in token info, look up from token lists
      toAddress = await tokenListManager.getTokenAddress(chain, toToken.symbol);
    }

    // Check if either token is the chain's native token (ETH)
    const isNativeFrom =
      fromToken.symbol === 'ETH' &&
      (chain === 'ethereum' || chain === 'optimism' || chain === 'arbitrum' || chain === 'base');

    const isNativeTo =
      toToken.symbol === 'ETH' &&
      (chain === 'ethereum' || chain === 'optimism' || chain === 'arbitrum' || chain === 'base');

    const isNativeMatic = fromToken.symbol === 'MATIC' && chain === 'polygon';
    const isNativeMaticTo = toToken.symbol === 'MATIC' && chain === 'polygon';

    // Format currency parameters
    const currencyFrom = isNativeFrom || isNativeMatic ? 'NATIVE' : fromAddress;
    const currencyTo = isNativeTo || isNativeMaticTo ? 'NATIVE' : toAddress;

    // Use the token amount that was already calculated in createRecommendation
    const finalTokenAmount = tokenAmount > 0 ? tokenAmount : 1.0;

    // Generate the Uniswap link with the token amount (not USD value)
    const uniswapLink = `https://app.uniswap.org/swap?inputCurrency=${currencyFrom}&outputCurrency=${currencyTo}&value=${finalTokenAmount.toFixed(6)}&chain=${chain}`;

    // Return updated recommendation
    return {
      ...recommendation,
      uniswapLink,
    };
  } catch (error) {
    console.error('Error updating swap recommendation with token addresses:', error);
    // Return the original recommendation if lookup fails
    return recommendation;
  }
}

/**
 * Creates a swap recommendation by token symbols
 */
export async function createSwapBySymbols(
  fromSymbol: string,
  toSymbol: string,
  amount: number,
  chain: string,
  reason: string,
  tokenListManager: TokenListManager
): Promise<RebalanceRecommendation | null> {
  try {
    // Check for hardcoded addresses first
    let fromAddress = HARDCODED_ADDRESSES[chain]?.[fromSymbol];
    let toAddress = HARDCODED_ADDRESSES[chain]?.[toSymbol];

    // If not hardcoded, get from token list manager
    if (!fromAddress) {
      fromAddress = await tokenListManager.getTokenAddress(chain, fromSymbol);
    }

    if (!toAddress) {
      toAddress = await tokenListManager.getTokenAddress(chain, toSymbol);
    }

    if (!fromAddress || !toAddress) {
      console.error(`Could not find addresses for tokens: ${fromSymbol} or ${toSymbol}`);
      return null;
    }

    // Create basic token info objects
    // Note: We're missing some info like price that would be available from Zerion API
    const fromToken: TokenInfo = {
      symbol: fromSymbol,
      name: fromSymbol, // Using symbol as name since we don't have the actual name
      chain,
      address: fromAddress,
      value: amount, // Setting value to the amount for simplicity
      percentage: 0, // Not relevant for direct swap
      type: 'wallet',
      price: 0, // We don't have price info here
      quantity: 0, // We don't have quantity info here
    };

    const toToken: TokenInfo = {
      symbol: toSymbol,
      name: toSymbol, // Using symbol as name since we don't have the actual name
      chain,
      address: toAddress,
      value: 0, // We don't know the value yet
      percentage: 0, // Not relevant for direct swap
      type: 'wallet',
      price: 0, // We don't have price info here
      quantity: 0, // We don't have quantity info here
    };

    // Create the recommendation
    const recommendation = createSwapRecommendation(fromToken, toToken, reason, amount);

    // Update with token addresses to generate the link
    return await updateSwapWithTokenAddresses(recommendation, tokenListManager);
  } catch (error) {
    console.error('Error creating swap by symbols:', error);
    return null;
  }
}

/**
 * Format a swap recommendation as a user-friendly string
 */
export function formatSwapResponse(recommendation: RebalanceRecommendation): string {
  const { fromToken, toToken, reason, uniswapLink, valueToSwap, tokenAmount } = recommendation;

  return `
## Swap Recommendation

I suggest swapping **${tokenAmount ? tokenAmount.toFixed(6) : '?'} ${fromToken.symbol}** (about $${valueToSwap.toFixed(2)}) to **${toToken.symbol}**.

### Why make this swap?
${reason}

You can execute this swap on Uniswap:
@${uniswapLink}
`;
}
