import { API_URL } from '@/constants';
import axios from 'axios';

import { AgentId, MessageContent } from '@getgrowly/core';

export interface AgentChatResponse {
  agent: string;
  tools: MessageContent[];
}

export class ChatService {
  constructor() {}

  async chat(payload: {
    message: string;
    agentId: AgentId;
    userId: string;
    stepId: AgentId;
    isBeastMode?: boolean;
  }): Promise<{
    reply: AgentChatResponse;
  }> {
    try {
      const response = await axios.post(`${API_URL}/chat`, payload, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

export const chatService = new ChatService();
