import { create } from 'zustand';

import {
  AggregatedWorkflow,
  ParsedStep,
  ParsedStepInsert,
  Status,
  StepId,
  WithId,
} from '@getgrowly/core';

export type WorkflowDetailStore = {
  workflow: AggregatedWorkflow | null;
  getStepById: (stepId: StepId) => ParsedStep | null;
  getSteps: () => ParsedStep[];
  setWorkflow: (workflow: AggregatedWorkflow) => void;
  addStep: (step: WithId<ParsedStepInsert>) => void;
  deleteStep: (stepId: StepId) => void;
  updateStep: (step: WithId<ParsedStepInsert>) => void;
};

export const useWorkflowDetailStore = create<WorkflowDetailStore>((set, get) => ({
  workflow: null,
  getStepById: (stepId: StepId) => get().workflow?.steps?.find(step => step.id === stepId) || null,
  getSteps: () => get().workflow?.steps || [],
  setWorkflow: (workflow: AggregatedWorkflow) => set({ workflow }),
  addStep: (step: WithId<ParsedStepInsert>) => {
    const { workflow } = get();
    if (!workflow) return;
    const updatedWorkflow = {
      ...workflow,
      steps: [
        ...(workflow.steps || []),
        {
          created_at: new Date().toISOString(),
          description: step.description || null,
          index: workflow.steps?.length || 0,
          status: Status.Active,
          workflow_id: workflow.id,
          is_beast_mode: step.is_beast_mode || false,
          is_repeat: false,
          ...step,
          id: step.id,
        },
      ],
    };
    set({ workflow: updatedWorkflow });
  },
  deleteStep: (stepId: StepId) => {
    const { workflow } = get();
    if (!workflow) return;
    const updatedSteps = workflow.steps?.filter(step => step.id !== stepId) || [];
    set({
      workflow: {
        ...workflow,
        steps: updatedSteps,
      },
    });
  },
  updateStep: (step: WithId<ParsedStepInsert>) => {
    const { workflow } = get();
    if (!workflow) return;
    const updatedSteps = workflow.steps?.map(s => {
      if (s.id === step.id) {
        return {
          ...s,
          ...step,
        };
      }
      return s;
    });
    set({
      workflow: {
        ...workflow,
        steps: updatedSteps || [],
      },
    });
  },
}));
