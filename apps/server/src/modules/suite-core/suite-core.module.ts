import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DatabaseModule } from '../databases/database.module';
import { SuiteCoreController } from './suite-core.controller';
import { SuiteCoreService } from './suite-core.service';

@Module({
  imports: [ConfigModule, DatabaseModule],
  controllers: [SuiteCoreController],
  providers: [SuiteCoreService],
})
export class SuiteCoreModule {}
