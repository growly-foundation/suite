import { Tables } from '@/types/database.types';

import { Agent } from './agents';
import { AggregatedWorkflow } from './workflows';

export type Organization = Tables<'organizations'>;
export type AggregatedOrganization = Organization & {
  workflows: AggregatedWorkflow[];
  agents: Agent[];
};
