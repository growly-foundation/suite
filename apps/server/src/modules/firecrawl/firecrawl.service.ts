import FirecrawlApp from '@mendable/firecrawl-js';
import { Inject, Injectable } from '@nestjs/common';

type FirecrawlScrapeOptions = {
  formats?: (
    | 'markdown'
    | 'html'
    | 'rawHtml'
    | 'content'
    | 'links'
    | 'screenshot'
    | 'screenshot@fullPage'
    | 'extract'
    | 'json'
    | 'changeTracking'
  )[];
  headers?: Record<string, string>;
  includeTags?: string[];
  excludeTags?: string[];
  onlyMainContent?: boolean;
};

type FirecrawlSearchOptions = {
  limit?: number;
  includeTags?: string[];
  excludeTags?: string[];
  onlyMainContent?: boolean;
};

type FirecrawlCrawlOptions = {
  limit?: number;
  scrapeOptions?: FirecrawlScrapeOptions;
};

@Injectable()
export class FirecrawlService {
  constructor(
    @Inject('FIRECRAWL_CLIENT')
    private readonly app: FirecrawlApp
  ) {}

  async crawlUrl(url: string, options?: FirecrawlCrawlOptions) {
    return this.app.crawlUrl(url, {
      limit: 100,
      scrapeOptions: {
        formats: ['markdown'],
        ...options?.scrapeOptions,
      },
      ...options,
    });
  }

  async scrapeUrl(url: string, options?: FirecrawlScrapeOptions) {
    return this.app.scrapeUrl(url, {
      formats: ['markdown'],
      ...options,
    });
  }

  async search(query: string, options?: FirecrawlSearchOptions) {
    return this.app.search(query, { limit: 5, ...options });
  }
}
