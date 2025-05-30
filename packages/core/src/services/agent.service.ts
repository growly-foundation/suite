import { AggregatedAgent, AggregatedWorkflow, Status } from '@/models';

import { PublicDatabaseService } from './database.service';
import { WorkflowService } from './workflow.service';

export class AgentService {
  constructor(
    private agentDatabaseService: PublicDatabaseService<'agents'>,
    private agentWorkflowsDatabaseService: PublicDatabaseService<'agent_workflows'>,
    private workflowService: WorkflowService
  ) {}

  async createOrUpdate(
    organization_id: string,
    agent: AggregatedAgent,
    isNewAgent: boolean
  ): Promise<AggregatedAgent> {
    const payload = {
      description: agent.description,
      name: agent.name,
      model: agent.model,
      organization_id,
      resources: agent.resources,
      status: agent.status,
    };
    const updatedAgent = isNewAgent
      ? await this.agentDatabaseService.create(payload)
      : await this.agentDatabaseService.update(agent.id, payload);

    // Update associations and track visited workflows.
    const visited: Record<string, boolean> = {};
    for (const workflow of agent.workflows) {
      try {
        await this.agentWorkflowsDatabaseService.create({
          agent_id: updatedAgent.id,
          workflow_id: workflow.id,
          status: Status.Active,
        });
        visited[workflow.id] = true;
      } catch (error) {
        console.log(error);
        continue;
      }
    }

    // Remove associations that are no longer in the list
    const existingWorkflows = await this.agentWorkflowsDatabaseService.getAllByFields({
      agent_id: updatedAgent.id,
    });
    for (const workflow of existingWorkflows) {
      if (visited[workflow.workflow_id]) continue;
      await this.agentWorkflowsDatabaseService.deleteByFields({
        agent_id: updatedAgent.id,
        workflow_id: workflow.workflow_id,
      });
    }
    return {
      ...updatedAgent,
      workflows: agent.workflows,
    };
  }

  async getAggregatedAgentsByOrganizationId(organization_id: string): Promise<AggregatedAgent[]> {
    const agents = await this.agentDatabaseService.getAllByFields({
      organization_id,
    });
    const aggregatedAgents: AggregatedAgent[] = [];
    for (const agent of agents) {
      const agentWithWorkflows = await this.getAggregatedAgent(agent.id);
      if (!agentWithWorkflows) continue;
      aggregatedAgents.push(agentWithWorkflows);
    }
    return aggregatedAgents;
  }

  async getAggregatedAgent(agent_id: string): Promise<AggregatedAgent | null> {
    const agent = await this.agentDatabaseService.getById(agent_id);
    if (!agent) return null;
    const agentWorkflows = await this.agentWorkflowsDatabaseService.getAllByFields({
      agent_id,
    });

    const workflows: AggregatedWorkflow[] = [];
    for (const { workflow_id } of agentWorkflows) {
      const workflow = await this.workflowService.getWorkflowWithSteps(workflow_id);
      if (!workflow) {
        continue;
      }
      workflows.push(workflow);
    }

    return {
      ...agent,
      workflows,
    };
  }
}
