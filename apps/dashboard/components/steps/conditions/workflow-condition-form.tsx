'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { generateId } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import { ConditionType, ScalarWorkflowCondition, WorkflowId } from '@getgrowly/core';

interface WorkflowConditionProps {
  onAdd: (data: ScalarWorkflowCondition) => void;
}

export function WorkflowCondition({ onAdd }: WorkflowConditionProps) {
  const [workflowId, setWorkflowId] = useState<string | undefined>(undefined);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="workflowId">Workflow ID</Label>
        <Input
          id="workflowId"
          value={workflowId}
          onChange={e => setWorkflowId(e.target.value)}
          placeholder="Enter workflow ID"
        />
      </div>
      <Button
        type="button"
        onClick={() => {
          if (!workflowId) return;
          onAdd({ type: ConditionType.Workflow, data: workflowId, id: generateId() });
        }}
        disabled={!workflowId}>
        <Plus className="mr-2 h-4 w-4" />
        Add Workflow Dependency
      </Button>
    </div>
  );
}
