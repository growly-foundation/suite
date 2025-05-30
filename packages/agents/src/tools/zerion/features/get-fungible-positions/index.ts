import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

import { makeToolDescription } from '../../../../utils/tools';
import { buildTool } from '../../../../utils/tools';
import { getFungiblesPositionsToolFn } from './core';

export function makeGetFungiblePositionsTool() {
  return new DynamicStructuredTool({
    name: 'get_fungible_positions',
    description: makeToolDescription({
      description: `Returns wallet’s token holdings in USD, including DeFi positions and top tokens by value.`,
      input: {
        walletAddress: {
          description: 'Wallet address',
          required: true,
        },
      },
      output: [
        {
          type: 'text',
          description: 'Summary of token holdings.',
        },
      ],
    }),
    schema: z
      .object({
        walletAddress: z.string().describe('The wallet address to fetch fungible positions'),
      })
      .strip()
      .describe('Input schema for fetching fungible positions'),
    func: buildTool(getFungiblesPositionsToolFn),
  });
}
