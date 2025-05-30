'use client';

import type { AggregatedWorkflow } from '@getgrowly/core';

import { WorkflowCard } from './workflow-card';

export function WorkflowsList({ workflows }: { workflows: AggregatedWorkflow[] }) {
  return (
    <div className="space-y-4">
      {workflows.map(workflow => (
        <WorkflowCard key={workflow.id} workflow={workflow} />
      ))}
    </div>
  );
}
