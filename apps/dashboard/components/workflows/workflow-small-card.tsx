import { cn } from '@/lib/utils';
import { WorkflowIcon } from 'lucide-react';

import { Workflow } from '@getgrowly/core';

export const WorkflowSmallCard = ({
  workflow,
  isSelected,
  onClick,
}: {
  workflow: Workflow;
  isSelected: boolean;
  onClick: (workflow: Workflow) => void;
}) => {
  return (
    <div
      key={workflow.id}
      className={cn(
        `p-3 rounded-md border cursor-pointer transition-all flex items-center gap-4`,
        isSelected
          ? 'border-primary bg-primary/5 text-primary dark:bg-primary/10 dark:text-primary'
          : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900'
      )}
      onClick={e => {
        e.stopPropagation();
        onClick(workflow);
      }}>
      <WorkflowIcon className="h-6 w-6" />
      <div>
        <div className="font-medium">{workflow.name}</div>
        <div className="text-xs text-muted-foreground mt-1">
          {workflow.description || 'No description'}
        </div>
      </div>
    </div>
  );
};
