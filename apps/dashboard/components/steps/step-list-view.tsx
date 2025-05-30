import { useWorkflowDetailStore } from '@/hooks/use-workflow-details';
import React, { useState } from 'react';

import { ParsedStep } from '@getgrowly/core';

import { AddStepDrawer } from './add-step-drawer';
import { StepCard } from './step-card';

export const StepListView = ({ steps }: { steps: ParsedStep[] }) => {
  const { updateStep, deleteStep, workflow } = useWorkflowDetailStore();
  const [isEditOpen, setIsEditOpen] = useState(false);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {steps.map(step => (
        <React.Fragment>
          <StepCard
            key={step.id}
            step={step}
            onEdit={() => setIsEditOpen(true)}
            onDelete={() => deleteStep(step.id)}
          />
          <AddStepDrawer
            open={isEditOpen}
            onOpenChange={setIsEditOpen}
            onAdd={updateStep}
            workflowId={workflow?.id || ''}
            defaultStep={step}
          />
        </React.Fragment>
      ))}
    </div>
  );
};
