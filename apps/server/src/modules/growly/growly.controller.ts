import { Body, Controller, Post } from '@nestjs/common';

import { ChatService } from '../chat/chat.service';

@Controller('growly')
export class GrowlyController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(
    @Body('message') message: string,
    @Body('userId') userId: string,
    @Body('agentId') agentId: string,
    @Body('stepId') stepId: string
  ) {
    // TODO: Implement growly chat
    const reply = await this.chatService.advancedChat({ message, userId, agentId });
    return {
      reply,
    };
  }
}
