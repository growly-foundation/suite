import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

import { buildTool, makeToolDescription } from '../../../../utils/tools';
import { suggestSwap } from '../suggest-swap/core';

export function makeGenerateIntentTool() {
  return new DynamicStructuredTool({
    name: 'generate_intent',
    description: makeToolDescription({
      description: `Generates a Uniswap swap link to exchange one token for another. Includes reasoning and a pre-filled link.`,
      input: {
        fromToken: {
          description: 'Token symbol to swap from (e.g. "ETH")',
          required: true,
        },
        toToken: {
          description: 'Token symbol to swap to (e.g. "USDC")',
          required: true,
        },
        amount: {
          description: 'USD amount to swap',
          required: true,
        },
        chain: {
          description: 'Blockchain for the swap (e.g. "ethereum")',
          required: false,
        },
      },
      output: [
        {
          type: 'uniswap:swap',
          description: 'Uniswap swap intent',
        },
      ],
    }),
    schema: z
      .object({
        fromToken: z.string().describe('Token symbol to swap from (e.g. "ETH")'),
        toToken: z.string().describe('Token symbol to swap to (e.g. "USDC")'),
        amount: z.number().describe('USD amount to swap'),
        chain: z
          .enum(['ethereum', 'base', 'optimism', 'arbitrum', 'polygon'] as const)
          .describe('Blockchain for the swap')
          .default('ethereum'),
      })
      .describe('Input schema for swap suggestions'),
    func: buildTool(suggestSwap),
  });
}
