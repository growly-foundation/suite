import { Module } from '@nestjs/common';

import { AgentModule } from '../agent/agent.module';
import { MessageModule } from '../message/message.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [AgentModule, MessageModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
