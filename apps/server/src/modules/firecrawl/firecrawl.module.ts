import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { FirecrawlProvider } from './firecrawl.provider';
import { FirecrawlService } from './firecrawl.service';

@Module({
  imports: [ConfigModule],
  providers: [FirecrawlProvider, FirecrawlService],
  exports: [FirecrawlProvider, FirecrawlService],
})
export class FirecrawlModule {}
