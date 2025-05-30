import FirecrawlApp from '@mendable/firecrawl-js';
import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export const FirecrawlProvider: Provider = {
  provide: 'FIRECRAWL_CLIENT',
  inject: [ConfigService],
  useFactory: (configService: ConfigService): FirecrawlApp => {
    const apiKey = configService.get<string>('FIRECRAWL_API_KEY');

    if (!apiKey) {
      throw new Error('Firecrawl API key must be provided');
    }

    return new FirecrawlApp({
      apiKey,
    });
  },
};
