import { TokenListManager } from '@/config/token-list';
import { ToolOutputValue } from '@/utils/tools';

import { createSwapBySymbols, formatSwapResponse } from '../../swap-utils';

export const suggestSwap =
  () =>
  async ({ fromToken, toToken, amount, chain, reason }): Promise<ToolOutputValue[]> => {
    const tokenListManager = new TokenListManager();
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
        return [
          {
            type: 'system:error',
            content: `Unable to create a swap link for ${fromToken} to ${toToken} on ${chain}. One or both tokens may not be supported or found in our token lists.`,
          },
        ];
      }
      // Format the response
      return formatSwapResponse(recommendation);
    } catch (error) {
      return [
        {
          type: 'system:error',
          content: 'Failed to generate swap suggestion.',
        },
      ];
    }
  };
