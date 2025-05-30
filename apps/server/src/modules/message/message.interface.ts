import { FnReturnType, Message } from '@getgrowly/core';

export interface MessageInterface {
  /**
   * Store a message with its embedding
   */
  storeMessageWithEmbedding(
    message: string,
    threadId: string,
    userId: string,
    role: string,
    embedding?: number[]
  ): Promise<Message>;

  /**
   * Get conversation history for a thread and agent
   */
  getConversationHistory(threadId: string, userId: string): Promise<Message[]>;

  /**
   * Search for similar messages
   */
  searchSimilarMessages(
    query: string,
    userId: string,
    agentId: string,
    limit?: number
  ): Promise<FnReturnType<'match_messages'>>;

  /**
   * Create an embedding for text
   */
  createEmbedding(text: string): Promise<number[]>;
}
