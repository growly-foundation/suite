import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

import { buildTool, makeToolDescription } from '../../../../utils/tools';
import { analyzeAndSuggestRebalance } from './core';

export function makeRebalancePortfolioTool() {
  return new DynamicStructuredTool({
    name: 'rebalance_portfolio_suggestion',
    description: makeToolDescription({
      description:
        "Analyzes a user's crypto portfolio and suggests how to rebalance it for better risk management or performance. Returns a detailed recommendation with a pre-filled Uniswap swap link.",
      condition:
        'Triggers when users ask for portfolio rebalancing suggestions, diversification advice, or want help optimizing their holdings.',
      input: {
        walletAddress: { description: 'Wallet address to analyze', required: true },
        strategy: {
          description: 'Rebalancing strategy ("conservative", "moderate", or "aggressive")',
        },
      },
      output: [
        {
          type: 'text',
          description: 'A rebalancing recommendation with reasoning and a pre-filled Uniswap link.',
        },
        {
          type: 'uniswap:swap',
          description: 'Payload for swap intent to be used with Uniswap.',
        },
      ],
    }),
    schema: z
      .object({
        walletAddress: z
          .string()
          .describe('The wallet address to analyze for rebalancing recommendations'),
        strategy: z
          .enum(['conservative', 'moderate', 'aggressive'] as const)
          .describe('The rebalancing strategy preference')
          .default('moderate'),
      })
      .describe('Input schema for portfolio rebalance suggestions'),
    func: buildTool(analyzeAndSuggestRebalance),
  });
}
