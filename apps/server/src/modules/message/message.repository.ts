import { Inject, Injectable, Logger } from '@nestjs/common';
import OpenAI from 'openai';

import { ConversationRole, FnReturnType, Message, SuiteDatabaseCore } from '@getgrowly/core';

import { MessageInterface } from './message.interface';

@Injectable()
export class MessageRepository implements MessageInterface {
  private readonly logger = new Logger(MessageRepository.name);

  constructor(
    @Inject('GROWLY_SUITE_CORE') private readonly suiteCore: SuiteDatabaseCore,
    @Inject('OPENAI_CLIENT') private readonly openai: OpenAI
  ) {}

  async storeMessageWithEmbedding(
    message: string,
    userId: string,
    agentId: string,
    sender: ConversationRole,
    existingEmbedding?: number[]
  ): Promise<Message> {
    try {
      // Generate embedding if not provided
      const embedding = existingEmbedding || (await this.createEmbedding(message));

      // Store the message with its embedding
      const data = await this.suiteCore.db.messages.create({
        content: message,
        user_id: userId,
        agent_id: agentId,
        sender,
        embedding: JSON.stringify(embedding),
      });

      if (!data) {
        throw new Error('No message found');
      }

      // Convert to Message entity
      return data;
    } catch (error) {
      this.logger.error('Failed to store message with embedding', error);
      throw error;
    }
  }

  async getConversationHistory(userId: string, agentId: string): Promise<Message[]> {
    try {
      const data = await this.suiteCore.db.messages.getAllByFields({
        user_id: userId,
        agent_id: agentId,
      });

      if (!data) {
        throw new Error('No message found');
      }

      // Convert to Message entities with proper typing
      return data;
    } catch (error) {
      this.logger.error('Failed to retrieve conversation history', error);
      throw error;
    }
  }

  async searchSimilarMessages(
    query: string,
    userId: string,
    agentId: string,
    limit = 5
  ): Promise<FnReturnType<'match_messages'>> {
    try {
      // Generate embedding for the query
      const embedding = await this.createEmbedding(query);

      // Search for similar messages
      const data = await this.suiteCore.fn.invoke('match_messages', {
        query_embedding: embedding.join(','),
        match_threshold: 0.7,
        match_count: limit,
        in_user_id: userId,
        in_agent_id: agentId,
      });

      // Convert to Message entities with proper typing
      return data;
    } catch (error) {
      this.logger.error('Failed to search similar messages', error);
      throw error;
    }
  }

  async createEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.openai.embeddings.create({
        model: 'text-embedding-3-small',
        input: text,
      });

      return response.data[0].embedding;
    } catch (error) {
      this.logger.error('Failed to create embedding', error);
      throw error;
    }
  }
}
