import { Tables, TablesInsert } from '@/types/database.types';

import { AgentId, StepId, WorkflowId } from './ids';

export type Step = Tables<'steps'>;
export type StepInsert = TablesInsert<'steps'>;

/**
 * A step is an action to be performed when a condition or multiple conditions is met.
 */
export type ParsedStep = Omit<Step, 'conditions' | 'action'> & {
  /** Conditions for the step to be triggered. Conditions will be checked in order. */
  conditions: Condition[];
  /** Action to be performed when the step is triggered. */
  action: Action[];
};

export type ParsedStepInsert = Omit<StepInsert, 'conditions' | 'action'> & {
  conditions: Condition[];
  action: Action[];
};

export type WithId<T> = { id: string } & T;
export type Condition = WithId<ScalarCondition | BranchingCondition>;

export type BranchingCondition = OrCondition | AndCondition;

export enum ConditionType {
  Always = 'always',
  Step = 'step',
  Workflow = 'workflow',
  UIEvent = 'uievent',
  JudgedByAgent = 'judgedByAgent',
  // Branching conditions
  Or = 'or',
  And = 'and',
}

/**
 * A single condition for a step to be triggered.
 *
 * The step will be triggered if defined conditions met.
 */
export type ScalarCondition = WithId<
  | ScalarAlwaysCondition
  | ScalarStepCondition
  | ScalarWorkflowCondition
  | ScalarUIEventCondition
  | ScalarJudgedByAgentCondition
>;

export type ScalarAlwaysCondition = WithId<{ type: ConditionType.Always; data: boolean }>;
export type ScalarStepCondition = WithId<{ type: ConditionType.Step; data: StepId }>;
export type ScalarWorkflowCondition = WithId<{ type: ConditionType.Workflow; data: WorkflowId }>;
export type ScalarUIEventCondition = WithId<{
  type: ConditionType.UIEvent;
  data: UIEventCondition;
}>;
export type ScalarJudgedByAgentCondition = WithId<{
  type: ConditionType.JudgedByAgent;
  data: JudgedByAgentCondition;
}>;

/**
 * A condition is fulfilled if any of the conditions are true.
 */
export type OrCondition = WithId<{ type: ConditionType.Or; data: ScalarCondition[] }>;

/**
 * A condition is fulfilled if all of the conditions are true.
 */
export type AndCondition = WithId<{
  type: ConditionType.And;
  data: ScalarCondition[];
}>;

/**
 * An event condition for a step to be triggered.
 */
export enum UIEventCondition {
  /** The condition is true when the page is loaded. */
  OnPageLoad = 'onPageLoad',
  /** The condition is true when the element is visited. */
  OnVisited = 'onVisited',
  /** The condition is true when the element is clicked. */
  OnClicked = 'onClicked',
  /** The condition is true when the element is hovered. */
  OnHovered = 'onHovered',
}

/**
 * A condition is fulfilled if the agent judges the step as true.
 * The agent will be asked to judge the step.
 */
export interface JudgedByAgentCondition {
  /** The step ID to be judged. */
  stepId: StepId;
  /** The agent ID to judge the step. */
  agentId: AgentId | undefined;
  /** The prompt to be sent to the agent. */
  prompt: string;
}

/**
 * An action to be performed when a step is triggered.
 */
export type Action = WithId<TextAction | AgentAction>;

/**
 * A text action is an action that returns a text.
 */
export type TextAction = WithId<{ type: 'text'; return: { text: string } }>;

/**
 * An agent action is an action that is performed by an agent.
 *
 * Returns another action.
 */
export type AgentAction = WithId<{
  type: 'agent';
  args: {
    /** Example: "Analyze the following portfolio?" */
    prompt: string;
    isBeastMode?: boolean;
  };
  return: Action;
}>;
