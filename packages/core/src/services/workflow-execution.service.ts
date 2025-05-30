import { AggregatedWorkflow, Status } from '@/models';
import { StepId, WorkflowId } from '@/models/ids';
import { Action, Condition, ConditionType, ParsedStep } from '@/models/steps';
import { UIEventCondition } from '@/models/steps';

type DependencyMap = {
  uiEvent: Map<UIEventCondition, ParsedStep[]>;
  stepCompleted: Map<StepId, ParsedStep[]>;
  workflowCompleted: Map<WorkflowId, ParsedStep[]>;
  judgedByAgent: Map<StepId, ParsedStep[]>;
  always: ParsedStep[];
};

/**
 * Handles the execution of workflows.
 */
export class WorkflowExecutionService {
  private dependencyMap: DependencyMap;
  private completedSteps = new Set<StepId>();
  private completedWorkflows = new Set<WorkflowId>();
  private agentJudgments = new Map<StepId, boolean>();
  private executeStep: (step: ParsedStep) => void;

  constructor(workflows: AggregatedWorkflow[], executeStep: (step: ParsedStep) => void) {
    this.executeStep = executeStep;
    this.dependencyMap = this.buildDependencyMap(workflows);
    this.triggerAlwaysSteps();
  }

  triggerUIEvent(
    event: UIEventCondition,
    stepId?: StepId,
    conditions?: Condition[]
  ): Promise<void> {
    console.log('Triggering UI event', event, stepId, conditions);
    const steps = this.dependencyMap.uiEvent.get(event) || [];
    if (conditions) {
      if (!this.evaluateConditions(conditions)) return Promise.resolve();
    }
    if (stepId) {
      const step = steps.find(s => s.id === stepId);
      if (!step) return Promise.resolve();
      return this.evaluateAndExecuteStep(step);
    } else {
      return this.evaluateAndExecuteSteps(steps);
    }
  }

  handleAgentJudgment(stepId: StepId, accepted: boolean): Promise<void> {
    this.agentJudgments.set(stepId, accepted);
    const steps = this.dependencyMap.judgedByAgent.get(stepId) || [];
    return this.evaluateAndExecuteSteps(steps);
  }

  private markStepCompleted(stepId: StepId): Promise<void> {
    this.completedSteps.add(stepId);
    const steps = this.dependencyMap.stepCompleted.get(stepId) || [];
    return this.evaluateAndExecuteSteps(steps);
  }

  private markWorkflowCompleted(workflowId: WorkflowId): Promise<void> {
    this.completedWorkflows.add(workflowId);
    const steps = this.dependencyMap.workflowCompleted.get(workflowId) || [];
    return this.evaluateAndExecuteSteps(steps);
  }

  private async evaluateAndExecuteSteps(steps: ParsedStep[]) {
    for (const step of steps) {
      await this.evaluateAndExecuteStep(step);
    }
  }

  private async evaluateAndExecuteStep(step: ParsedStep) {
    if (this.evaluateConditions(step.conditions)) {
      await this.executeStep(step);
      await this.markStepCompleted(step.id);
    }
  }

  private evaluateConditions(conditions: Condition[]): boolean {
    return conditions.every(cond => this.evaluateCondition(cond));
  }

  private evaluateCondition(cond: Condition): boolean {
    switch (cond.type) {
      case ConditionType.Always:
        return true;
      case ConditionType.Step:
        return this.completedSteps.has(cond.data);
      case ConditionType.Workflow:
        return this.completedWorkflows.has(cond.data);
      case ConditionType.JudgedByAgent:
        return this.agentJudgments.get(cond.data.stepId) === true;
      case ConditionType.And:
        return cond.data.every((sub: Condition) => this.evaluateCondition(sub));
      case ConditionType.Or:
        return cond.data.some((sub: Condition) => this.evaluateCondition(sub));
      case ConditionType.UIEvent:
        return false; // UIEvent should trigger via triggerUIEvent
      default:
        return false;
    }
  }

  private buildDependencyMap(workflows: AggregatedWorkflow[]): DependencyMap {
    const map: DependencyMap = {
      uiEvent: new Map(),
      stepCompleted: new Map(),
      workflowCompleted: new Map(),
      judgedByAgent: new Map(),
      always: [],
    };
    for (const wf of workflows) {
      if (wf.status === Status.Inactive) continue;
      for (const step of wf.steps) {
        for (const cond of step.conditions) {
          this.collectStepDependencies(cond, step, map);
        }
      }
    }
    return map;
  }

  private collectStepDependencies(cond: Condition, step: ParsedStep, map: DependencyMap): void {
    switch (cond.type) {
      case ConditionType.Always:
        map.always.push(step);
        break;
      case ConditionType.UIEvent:
        this.addToMap(map.uiEvent, cond.data, step);
        break;
      case ConditionType.Step:
        this.addToMap(map.stepCompleted, cond.data, step);
        break;
      case ConditionType.Workflow:
        this.addToMap(map.workflowCompleted, cond.data, step);
        break;
      case ConditionType.JudgedByAgent:
        this.addToMap(map.judgedByAgent, cond.data.stepId, step);
        break;
      case ConditionType.And:
      case ConditionType.Or:
        for (const sub of cond.data) {
          this.collectStepDependencies(sub, step, map);
        }
        break;
    }
  }

  private addToMap<K>(map: Map<K, ParsedStep[]>, key: K, step: ParsedStep) {
    if (!map.has(key)) map.set(key, []);
    map.get(key)!.push(step);
  }

  private triggerAlwaysSteps() {
    const steps = this.dependencyMap.always;
    this.evaluateAndExecuteSteps(steps);
  }
}
