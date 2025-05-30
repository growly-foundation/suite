import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { SuiteCoreProvider } from './suite.provider';

@Module({
  imports: [ConfigModule],
  providers: [SuiteCoreProvider],
  exports: [SuiteCoreProvider],
})
export class DatabaseModule {}
