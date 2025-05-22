'use client';

import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { Condition, ConditionType, StepId, UIEventCondition } from '@getgrowly/core';
import { ConditionTreeView } from './condition-tree-view';
import { useWorkflowDetailStore } from '@/hooks/use-workflow-details';
import { getConditionLabel } from '@/lib/workflow.utils';

interface ConditionItemProps {
  condition: Condition;
  onRemove: (id: StepId) => void;
  disableRemove?: boolean;
}

export function ConditionItem({ condition, onRemove, disableRemove = false }: ConditionItemProps) {
  const { getSteps } = useWorkflowDetailStore();
  return (
    <div className="flex items-center justify-between px-4 border rounded-md">
      <ConditionTreeView nodes={getConditionLabel(condition, getSteps())} />
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(condition.id)}
        disabled={disableRemove}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}
