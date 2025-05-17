'use client';

import { Button } from '@/components/ui/button';
import { getActionLabel } from '@/lib/workflow.utils';
import { Action } from '@getgrowly/core';
import { Trash } from 'lucide-react';

interface ActionItemProps {
  action: Action;
  onRemove: (id: string) => void;
  disableRemove?: boolean;
}

export function ActionItem({ action, onRemove, disableRemove = false }: ActionItemProps) {
  const actionLabel = getActionLabel(action);
  return (
    <div className="flex items-center justify-between p-2 border rounded-md">
      <span className="text-sm truncate px-4 flex items-center gap-2">
        {actionLabel.icon}
        <span className="font-medium">{actionLabel.title}</span>
        <span>{actionLabel.content}</span>
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(action.id)}
        disabled={disableRemove}>
        <Trash className="h-4 w-4" />
      </Button>
    </div>
  );
}
