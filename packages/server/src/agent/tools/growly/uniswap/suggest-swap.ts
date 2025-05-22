import { DynamicStructuredTool } from '@langchain/core/tools';
import { ConfigService } from '@nestjs/config';
import { z } from 'zod';
import { TokenListManager } from './token-list';
import { createSwapBySymbols, formatSwapResponse } from './swap-utils';

export function makeSuggestSwapTool(configService: ConfigService) {
  // Create token list manager
  const tokenListManager = new TokenListManager();

  return new DynamicStructuredTool({
    name: 'suggest_swap',
    description: `
Generates a pre-filled Uniswap swap link for exchanging one token for another.
Returns a detailed recommendation with reasoning and a direct swap link.

Triggers when users ask for help swapping tokens or want a link to trade specific tokens.

Input:
- fromToken: Symbol of the token to swap from (e.g., "ETH", "USDC")
- toToken: Symbol of the token to swap to (e.g., "USDC", "ETH")
- amount: Amount in USD to swap
- chain: Blockchain to use (e.g., "ethereum", "base", "optimism", "arbitrum", "polygon")
- reason: Reason for suggesting this swap (optional)

Output:
- A swap recommendation with a pre-filled Uniswap link.
`,
    schema: z
      .object({
        fromToken: z.string().describe('The token symbol to swap from (e.g., "ETH", "USDC")'),
        toToken: z.string().describe('The token symbol to swap to (e.g., "USDC", "ETH")'),
        amount: z.number().describe('Amount in USD to swap'),
        chain: z
          .enum(['ethereum', 'base', 'optimism', 'arbitrum', 'polygon'] as const)
          .describe('Blockchain to use for the swap')
          .default('ethereum'),
        reason: z
          .string()
          .describe('Reason for suggesting this swap')
          .default('Custom token swap requested by user'),
      })
      .describe('Input schema for swap suggestions'),
    func: async ({ fromToken, toToken, amount, chain, reason }) => {
      try {
        // Create a swap recommendation by symbols
        const recommendation = await createSwapBySymbols(
          fromToken,
          toToken,
          amount,
          chain,
          reason,
          tokenListManager
        );

        if (!recommendation) {
          return `Unable to create a swap link for ${fromToken} to ${toToken} on ${chain}. One or both tokens may not be supported or found in our token lists.`;
        }

        // Format the response
        return formatSwapResponse(recommendation);
      } catch (error) {
        if (error instanceof Error) {
          return `Failed to generate swap suggestion: ${error.message}`;
        }
        return 'Failed to generate swap suggestion.';
      }
    },
  });
}
