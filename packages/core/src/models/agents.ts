import { Tables } from '@/types/database.types';

import { Workflow } from './workflows';

export type Agent = Tables<'agents'>;
export type AggregatedAgent = Agent & { workflows: Workflow[] };
