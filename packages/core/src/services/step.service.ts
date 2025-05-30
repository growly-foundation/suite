import { AggregatedWorkflow, WorkflowId } from '@/models';

import { PublicDatabaseService } from './database.service';

export class StepService {
  constructor(private stepDatabaseService: PublicDatabaseService<'steps'>) {}

  async createStep(steps: AggregatedWorkflow['steps'], workflowId: WorkflowId) {
    let index = 0;
    // Existing steps.
    const existingSteps = await this.stepDatabaseService.getAllByFields({
      workflow_id: workflowId,
    });
    // Delete steps that are no longer in the list.
    for (const step of existingSteps) {
      if (!steps.find(s => s.id === step.id)) {
        await this.stepDatabaseService.delete(step.id);
      }
    }
    // Create or update steps.
    for (const step of steps) {
      const stepExists = existingSteps.find(s => s.id === step.id);
      if (stepExists) {
        await this.stepDatabaseService.update(stepExists.id, {
          action: JSON.stringify(step.action),
          conditions: JSON.stringify(step.conditions),
          description: step.description,
          name: step.name,
          status: step.status,
          is_beast_mode: step.is_beast_mode,
        });
      } else {
        await this.stepDatabaseService.create({
          id: step.id,
          workflow_id: workflowId,
          action: JSON.stringify(step.action),
          conditions: JSON.stringify(step.conditions),
          description: step.description,
          index,
          name: step.name,
          status: step.status,
          is_beast_mode: step.is_beast_mode,
        });
      }
      index++;
    }
  }
}
