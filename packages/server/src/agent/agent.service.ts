// import { ChatOpenAI } from '@langchain/openai';
import { SuiteDatabaseCore } from '@getgrowly/core';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { agentPromptTemplate, beastModeDescription } from './prompt';
import { AgentOptions, createAgent } from './utils/agent.factory';
import { ChatProvider } from './utils/model.factory';

interface AgentChatRequest {
  message: string;
  agentId: string;
  userId: string;
}

@Injectable()
export class AgentService {
  private readonly logger = new Logger(AgentService.name);

  constructor(
    private readonly configService: ConfigService,
    @Inject('GROWLY_SUITE_CORE') private readonly suiteCore: SuiteDatabaseCore
  ) {}

  // Use Langchain PromptTemplate for dynamic prompt construction
  private async getSystemPrompt(
    walletAddress: string,
    agentDescription: string,
    organizationName: string,
    organizationDescription: string,
    isBeastMode: boolean
  ): Promise<string> {
    const beastModePrompt = isBeastMode ? beastModeDescription : '';
    return (
      await agentPromptTemplate.invoke({
        walletAddress,
        agentDescription,
        organizationName,
        organizationDescription,
        beastModePrompt,
      })
    ).toString();
  }

  /**
   * Regular chat using the standard agent with persistence
   */
  async chat({ message, userId, agentId }: AgentChatRequest): Promise<string> {
    this.logger.log(`Processing chat request for agent ${agentId} and user ${userId}`);

    const user = await this.suiteCore.db.users.getById(userId);
    const walletAddress = user?.entities?.['walletAddress'] || '';

    const agentDetails = await this.suiteCore.db.agents.getById(agentId);
    const organization = await this.suiteCore.db.organizations.getById(
      agentDetails?.organization_id || ''
    );

    if (!agentDetails || user?.entities?.['walletAddress'] === null) {
      throw new Error('Agent or wallet address not found');
    }

    const agentDescription = agentDetails.description || '';
    const organizationName = organization?.name || '';
    const organizationDescription = organization?.description || '';

    // Get provider from config
    const provider: ChatProvider =
      (this.configService.get('MODEL_PROVIDER') as ChatProvider) || 'openai';

    // Get system prompt
    const systemPrompt = await this.getSystemPrompt(
      walletAddress,
      agentDescription,
      organizationName,
      organizationDescription,
      true // TODO: Make this dynamic
    );

    // Create agent options
    const agentOptions: AgentOptions = {
      provider,
      agentId,
      systemPrompt,
    };

    // Get or create agent with persistence
    const agent = await createAgent(agentOptions, this.configService);

    // Stream the response with thread persistence
    const stream = await agent.stream(
      { messages: [{ content: message, role: 'user' }] },
      { configurable: { thread_id: `${agentId}-${userId}` } }
    );

    let agentResponse = '';
    for await (const chunk of stream) {
      if ('agent' in chunk) {
        this.logger.debug(chunk.agent.messages[0].content);
        agentResponse += chunk.agent.messages[0].content;
      }
    }

    return agentResponse;
  }

  /**
   * Regular chat using the beast mode agent
   */
  async advancedChat({ message, userId, agentId }: AgentChatRequest): Promise<string> {
    this.logger.log(`Processing chat request for agent ${agentId} and user ${userId}`);

    const user = await this.suiteCore.db.users.getById(userId);
    const walletAddress = user?.entities?.['walletAddress'] || '';

    const agentDetails = await this.suiteCore.db.agents.getById(agentId);
    const organization = await this.suiteCore.db.organizations.getById(
      agentDetails?.organization_id || ''
    );

    if (!agentDetails || user?.entities?.['walletAddress'] === null) {
      throw new Error('Agent or wallet address not found');
    }

    const agentDescription = agentDetails.description || '';
    const organizationName = organization?.name || '';
    const organizationDescription = organization?.description || '';

    // Get provider from config
    const provider: ChatProvider =
      (this.configService.get('MODEL_PROVIDER') as ChatProvider) || 'openai';

    // Get system prompt
    const systemPrompt = await this.getSystemPrompt(
      walletAddress,
      agentDescription,
      organizationName,
      organizationDescription,
      true
    );

    // Create agent options
    const agentOptions: AgentOptions = {
      provider,
      agentId,
      systemPrompt,
    };

    // Get or create agent with persistence
    const agent = await createAgent(agentOptions, this.configService);

    // Stream the response with thread persistence
    const stream = await agent.stream(
      { messages: [{ content: message, role: 'user' }] },
      { configurable: { thread_id: `${agentId}-${userId}` } }
    );

    let agentResponse = '';
    for await (const chunk of stream) {
      if ('agent' in chunk) {
        this.logger.debug(chunk.agent.messages[0].content);
        agentResponse += chunk.agent.messages[0].content;
      }
    }

    return agentResponse;
  }
}
