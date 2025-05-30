import { ENV_VARIABLES } from '@/constants/env';

import { createSuiteCore } from '@getgrowly/core';

/**
 * SDK for interacting with the Growly Suite API.
 */
export const suiteCore = createSuiteCore(
  ENV_VARIABLES.SUPABASE_URL,
  ENV_VARIABLES.SUPABASE_ANON_KEY
);
