import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from '../databases/database.module';
import { AgentService } from './agent.service';

@Module({
  imports: [ConfigModule, DatabaseModule],
  providers: [AgentService],
  exports: [AgentService],
})
export class AgentModule {}
