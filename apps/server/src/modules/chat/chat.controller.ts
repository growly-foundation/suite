// src/chat/chat.controller.ts
import { Body, Controller, Post } from '@nestjs/common';

import { ChatService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  async chat(
    @Body('message') message: string,
    @Body('userId') userId: string,
    @Body('agentId') agentId: string,
    @Body('stepId') stepId: string,
    @Body('isBeastMode') isBeastMode: boolean
  ) {
    const reply = await this.chatService.dumbChat({ message, userId, agentId });
    return { reply };
  }
}
