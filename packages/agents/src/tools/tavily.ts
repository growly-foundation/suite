import { DynamicStructuredTool } from '@langchain/core/tools';
import { TavilySearch } from '@langchain/tavily';
import { z } from 'zod';

export function makeTavilyTools() {
  const tavilyApiKey = process.env.TAVILY_API_KEY;
  if (!tavilyApiKey) {
    throw new Error('TAVILY_API_KEY is not configured.');
  }

  // Create the original TavilySearch instance for reuse with DeFi focus
  const tavilySearchClient = new TavilySearch({
    tavilyApiKey,
    maxResults: 7, // Increased results for better context
    topic: 'finance', // Finance is the closest topic to DeFi
    includeAnswer: true,
    searchDepth: 'advanced', // More thorough search by default for crypto topics
  });

  // Create a wrapper tool that directly calls the search function
  const tavilySearchTool = new DynamicStructuredTool({
    name: 'crypto_search',
    description:
      'Search the web for information about cryptocurrency, blockchain, DeFi protocols, NFTs, and other blockchain-related topics. Provides real-time data about market conditions, protocol information, smart contracts, and blockchain technology.',
    schema: z.object({
      query: z.string().describe('The crypto/blockchain/DeFi search query to look up'),
      searchDepth: z
        .enum(['basic', 'advanced'])
        .optional()
        .describe(
          'The depth of search: "basic" (faster) or "advanced" (more thorough, better for technical crypto topics)'
        ),
      topic: z
        .enum(['general', 'news', 'finance'])
        .optional()
        .describe(
          'The topic category for the search: "general", "news", or "finance" (recommended for DeFi topics)'
        ),
    }),
    func: async ({ query, searchDepth, topic }) => {
      try {
        // Enhance query with crypto-specific context if not already present
        let enhancedQuery = query;
        const cryptoKeywords = [
          'crypto',
          'blockchain',
          'defi',
          'web3',
          'ethereum',
          'bitcoin',
          'token',
          'nft',
          'protocol',
        ];

        // Only enhance if query doesn't already contain crypto keywords
        if (!cryptoKeywords.some(keyword => query.toLowerCase().includes(keyword))) {
          // Add context but preserve the original query intent
          enhancedQuery = `${query} cryptocurrency defi blockchain`;
        }

        // Create the search params with the correct types
        const searchParams: any = { query: enhancedQuery };

        // Default to advanced search for crypto topics unless specified
        searchParams.searchDepth = searchDepth || 'advanced';

        // Default to finance for crypto topics unless specified
        searchParams.topic = topic || 'finance';

        // Execute the search directly
        const results = await tavilySearchClient.invoke(searchParams);

        // Process the results to prioritize crypto-related content
        if (results && Array.isArray(results)) {
          // No need to modify the results format, just make sure we're returning the full object
          return JSON.stringify(results, null, 2);
        }

        return JSON.stringify(results, null, 2);
      } catch (error: any) {
        console.error('Crypto search error:', error);
        return `Error executing crypto search: ${error.message || error}`;
      }
    },
  });

  return { tavilySearchTool };
}
