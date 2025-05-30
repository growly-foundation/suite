import { DynamicStructuredTool } from '@langchain/core/tools';
import { z } from 'zod';

import { buildTool } from '../../utils/tools';
import { getProtocolToolFn } from './core';

export const getProtocolTool = new DynamicStructuredTool({
  name: 'get_protocol',
  description: `
This tool will fetch detailed information about a specific protocol from DefiLlama.
Only prioritize this when user asking about TVL. Otherwise, use other Tavily tools to search the web.
It takes the following inputs:
- The protocol identifier from DefiLlama (e.g. uniswap)

Important notes:
- Returns null if the protocol is not found
- Returns comprehensive data including TVL, description, category, and other metadata
- Includes historical TVL data and chain-specific breakdowns where available
- Returns error message if the protocol ID is invalid or the request fails
- Prunes time-series data to 5 most recent entries to make the response more manageable
`,
  schema: z
    .object({
      protocolId: z.string().describe('The protocol identifier from DefiLlama'),
    })
    .strict(),
  func: buildTool(getProtocolToolFn),
});
