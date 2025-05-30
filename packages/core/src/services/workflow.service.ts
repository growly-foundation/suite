import { AgentId, OrganizationId, WorkflowId } from '@/models';
import { Action, Condition, ParsedStep, Step } from '@/models/steps';
import { AggregatedWorkflow } from '@/models/workflows';

import { PublicDatabaseService } from './database.service';

export class WorkflowService {
  constructor(
    private workflowDatabaseService: PublicDatabaseService<'workflows'>,
    private stepDatabaseService: PublicDatabaseService<'steps'>,
    private agentWorkflowsDatabaseService: PublicDatabaseService<'agent_workflows'>
  ) {}

  async getWorkflowWithSteps(workflowId: WorkflowId): Promise<AggregatedWorkflow | null> {
    try {
      const workflow = await this.workflowDatabaseService.getOneByFields({ id: workflowId });
      if (!workflow) throw new Error('Workflow not found');
      const steps = await this.stepDatabaseService.getAllByFields({
        workflow_id: workflow.id,
      });
      return {
        ...workflow,
        steps: steps.map(this.parseStep),
      };
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  async getWorkflowsByAgentId(agent_id: AgentId): Promise<AggregatedWorkflow[]> {
    const workflows = await this.agentWorkflowsDatabaseService.getAllByFields({
      agent_id,
    });
    const aggregatedWorkflows: AggregatedWorkflow[] = [];
    for (const { workflow_id } of workflows) {
      const workflow = await this.workflowDatabaseService.getOneByFields({ id: workflow_id });
      if (!workflow) throw new Error('Workflow not found');
      const steps = await this.stepDatabaseService.getAllByFields({
        workflow_id,
      });
      aggregatedWorkflows.push({
        ...workflow,
        steps: steps.map(this.parseStep),
      });
    }
    return aggregatedWorkflows;
  }

  async getWorkflowsByOrganizationId(
    organization_id: OrganizationId
  ): Promise<AggregatedWorkflow[]> {
    const workflows = await this.workflowDatabaseService.getAllByFields({
      organization_id,
    });
    const aggregatedWorkflows: AggregatedWorkflow[] = [];
    for (const workflow of workflows) {
      const steps = await this.stepDatabaseService.getAllByFields({
        workflow_id: workflow.id,
      });
      aggregatedWorkflows.push({
        ...workflow,
        steps: steps.map(this.parseStep),
      });
    }
    return aggregatedWorkflows;
  }

  private parseStep(step: Step): ParsedStep {
    return {
      ...step,
      // Expect an array of conditions and actions.
      conditions: step.conditions ? (JSON.parse(step.conditions as any) as Condition[]) : [],
      action: step.action ? (JSON.parse(step.action as any) as Action[]) : [],
    };
  }
}
