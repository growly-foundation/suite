import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

import { makeToolDescription } from '../../../../utils/tools';
import { buildTool } from '../../../../utils/tools';
import { getPortfolioOverviewToolFn } from './core';

export function makePortfolioOverviewTool() {
  return new DynamicStructuredTool({
    name: 'get_portfolio_overview',
    description: makeToolDescription({
      description: `Summarizes and returns portfolio in USD with total, 24h change, type breakdown, and top 5 chains.`,
      input: {
        walletAddress: {
          description: 'Portfolio wallet address',
          required: true,
        },
      },
      output: [
        {
          type: 'text',
          description: 'Summary of portfolio.',
        },
      ],
    }),
    schema: z
      .object({
        walletAddress: z.string().describe('The wallet address of the portfolio'),
      })
      .strip()
      .describe('Input schema for fetching portfolio'),
    func: buildTool(getPortfolioOverviewToolFn),
  });
}
