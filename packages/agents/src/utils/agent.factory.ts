import { DynamicStructuredTool } from '@langchain/core/tools';
import { createReactAgent } from '@langchain/langgraph/prebuilt';

import { getProtocolTool } from '../tools/defillama';
import { makeTavilyTools } from '../tools/tavily';
import { makeUniswapTools } from '../tools/uniswap';
import { makeZerionTools } from '../tools/zerion';
import { getCheckpointer } from './checkpointer';
import { ChatModelFactory, ChatProvider } from './model.factory';
import { collectTools } from './tools';

/**
 * Interface for tools registry
 */
export interface ToolsRegistry {
  zerion: boolean;
  uniswap: boolean;
  tavily: boolean;
}

/**
 * Interface for agent creation options
 */
export interface AgentOptions {
  provider?: ChatProvider;
  agentId: string;
  systemPrompt: string;
  tools?: Partial<ToolsRegistry>;
  verbose?: boolean;
}

const initializeTools = ({ zerion, uniswap, tavily }: Partial<ToolsRegistry>) => {
  const tools: DynamicStructuredTool[] = [getProtocolTool];
  if (zerion) tools.push(...collectTools(makeZerionTools()));
  if (uniswap) tools.push(...collectTools(makeUniswapTools()));
  if (tavily) tools.push(...collectTools(makeTavilyTools()));
  return tools;
};

/**
 * Initializes and returns an instance of the AI agent with a dynamic system prompt.
 *
 * @param options The agent creation options
 * @returns The initialized AI agent
 */
export async function createAgent(
  options: AgentOptions
): Promise<ReturnType<typeof createReactAgent>> {
  try {
    const { provider = 'openai', systemPrompt, verbose } = options;

    const llm = ChatModelFactory.create({ provider, verbose });
    // Use ConfigService for tool creation
    const tools = initializeTools(options.tools || {});
    const checkpointer = await getCheckpointer();

    // Initialize Agent with optional checkpointer
    return createReactAgent({
      llm,
      tools,
      prompt: systemPrompt,
      checkpointer: checkpointer as any,
    });
  } catch (error) {
    console.error('Error initializing agent:', error);
    throw error;
  }
}
