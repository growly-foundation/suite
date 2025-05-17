import { API_URL } from '@/constants';
import { AgentId } from '@getgrowly/core';
import axios from 'axios';

export class ChatService {
  constructor() {}

  async chat(payload: {
    message: string;
    agentId: AgentId;
    userId: string;
    stepId: AgentId;
    isBeastMode?: boolean;
  }): Promise<{
    reply: string;
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
