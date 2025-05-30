import { Module } from '@nestjs/common';

import { DatabaseModule } from '../databases/database.module';
import { OpenAIModule } from '../openai/openai.module';
import { MessageRepository } from './message.repository';
import { MessageService } from './message.service';

@Module({
  imports: [DatabaseModule, OpenAIModule],
  providers: [MessageService, MessageRepository],
  exports: [MessageService],
})
export class MessageModule {}
