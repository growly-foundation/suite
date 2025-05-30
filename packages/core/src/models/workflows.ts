import { Tables, TablesInsert } from '@/types/database.types';

import { StepId, WorkflowId } from './ids';
import { Condition, ParsedStep, ParsedStepInsert } from './steps';

export type Workflow = Tables<'workflows'>;
export type AggregatedWorkflow = Workflow & { steps: ParsedStep[] };
export type WorkflowInsert = TablesInsert<'workflows'> & { steps: ParsedStepInsert[] };

export type UserDefinedPayload = UserDefinedStep;

/**
 * A user defined step.
 */
export type UserDefinedStep = {
  type: 'step';
  payload: {
    /** Step ID. */
    id: StepId;
    /** Workflow ID. */
    workflow: WorkflowId;
    /** Conditions for the step to be triggered. Conditions will be checked in order. */
    conditions?: Condition[];
  };
};

export enum Status {
  /** The workflow is active. */
  Active = 'active',
  /** The workflow is inactive. */
  Inactive = 'inactive',
}
