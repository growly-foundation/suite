import { Module } from '@nestjs/common';
import { MessageModule } from 'src/message/message.module';
import { AgentModule } from '../agent/agent.module';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';

@Module({
  imports: [AgentModule, MessageModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
