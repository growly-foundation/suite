import { Injectable, Logger } from '@nestjs/common';

import { AgentService } from '../agent/agent.service';

interface ChatRequest {
  message: string;
  userId: string;
  agentId: string;
}

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  constructor(private readonly agentService: AgentService) {}

  async dumbChat({ message, userId, agentId }: ChatRequest) {
    try {
      this.logger.log('Processing with multi-agent supervisor...');
      const reply = await this.agentService.chat({
        message,
        userId,
        agentId,
      });
      // Return the response
      return reply;
    } catch (error) {
      this.logger.error(`Error in chat processing: ${error.message}`, error.stack);
      throw error;
    }
  }

  async advancedChat({ message, userId, agentId }: ChatRequest) {
    try {
      this.logger.log('Processing with multi-agent supervisor...');
      const reply = await this.agentService.advancedChat({
        message,
        userId,
        agentId,
      });
      // Return the response
      return reply;
    } catch (error) {
      this.logger.error(`Error in chat processing: ${error.message}`, error.stack);
      throw error;
    }
  }
}
