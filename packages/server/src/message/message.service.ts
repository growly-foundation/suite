import { Injectable } from '@nestjs/common';
import { MessageRepository } from './message.repository';
import { FnReturnType, Message, ConversationRole } from '@getgrowly/core';

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async storeMessage(
    message: string,
    userId: string,
    agentId: string,
    role: string
  ): Promise<Message> {
    return this.messageRepository.storeMessageWithEmbedding(
      message,
      userId,
      agentId,
      role as ConversationRole
    );
  }

  async getConversationHistory(userId: string, agentId: string): Promise<Message[]> {
    return this.messageRepository.getConversationHistory(userId, agentId);
  }

  async findSimilarMessages(
    query: string,
    userId: string,
    agentId: string,
    limit?: number
  ): Promise<FnReturnType<'match_messages'>> {
    return this.messageRepository.searchSimilarMessages(query, userId, agentId, limit);
  }

  async createEmbedding(text: string): Promise<number[]> {
    return this.messageRepository.createEmbedding(text);
  }
}
