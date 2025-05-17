'use client';

import { Button } from '@/components/ui/button';
import { generateId } from '@/lib/utils';
import { ConditionType, ScalarAlwaysCondition } from '@getgrowly/core';
import { Plus } from 'lucide-react';

interface AlwaysConditionProps {
  onAdd: (data: ScalarAlwaysCondition) => void;
}

export function AlwaysCondition({ onAdd }: AlwaysConditionProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        This condition is always true. The step will always be triggered.
      </p>
      <Button
        type="button"
        onClick={() => onAdd({ type: ConditionType.Always, data: true, id: generateId() })}>
        <Plus className="mr-2 h-4 w-4" />
        Add Always Condition
      </Button>
    </div>
  );
}
