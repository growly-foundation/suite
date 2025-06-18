import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { SuiteDatabaseCore, createSuiteCore } from '@getgrowly/core';

import { SUITE_CORE } from '../../constants/services';

export const SuiteCoreProvider: Provider = {
  provide: SUITE_CORE,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): SuiteDatabaseCore => {
    const supabaseUrl = configService.get<string>('SUPABASE_URL');
    const supabaseKey = configService.get<string>('SUPABASE_ANON_KEY');

    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase URL and key must be provided');
    }

    return createSuiteCore(supabaseUrl, supabaseKey);
  },
};
