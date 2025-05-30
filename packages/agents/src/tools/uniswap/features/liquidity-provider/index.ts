import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

import { buildTool, makeToolDescription } from '../../../../utils/tools';
import { analyzeAndSuggestLiquidityPools } from './core';

export function makeLiquidityProviderTool() {
  return new DynamicStructuredTool({
    name: 'provide_liquidity_suggestion',
    description: makeToolDescription({
      description: `Analyzes a user's crypto portfolio and suggests optimal token pairs for providing liquidity on Uniswap. \n Returns a detailed recommendation with a pre-filled Uniswap liquidity provision link.`,
      condition:
        'Triggers when users ask about providing liquidity, earning passive income with their crypto, or want to maximize yield.',
      input: {
        walletAddress: {
          description: 'Wallet address to analyze for liquidity provision opportunities',
          required: true,
        },
        riskLevel: {
          description: 'Preferred risk level for liquidity provision',
          required: false,
        },
      },
      output: [
        {
          type: 'text',
          description: 'Liquidity provision plan with reasoning and a pre-filled Uniswap link',
        },
      ],
    }),
    schema: z
      .object({
        walletAddress: z
          .string()
          .describe('The wallet address to analyze for liquidity provision opportunities'),
        riskLevel: z
          .enum(['conservative', 'moderate', 'aggressive'] as const)
          .describe('The preferred risk level for liquidity provision')
          .default('moderate'),
      })
      .describe('Input schema for liquidity provision suggestions'),
    func: buildTool(analyzeAndSuggestLiquidityPools),
  });
}
