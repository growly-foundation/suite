import { Badge } from '@/components/ui/badge';
import { ConditionItemNode } from '@/lib/workflow.utils';
import React from 'react';

type ConditionTreeViewProps = {
  nodes: ConditionItemNode[];
};

export const ConditionTreeView: React.FC<ConditionTreeViewProps> = ({ nodes }) => {
  return (
    <ul style={{ listStyleType: 'none', paddingLeft: '1rem', margin: 0 }}>
      {nodes.map((node, index) => (
        <li key={index} style={{ margin: '5px' }}>
          <div>
            <Badge
              variant={
                node.status === 'success'
                  ? 'default'
                  : node.status === 'error'
                    ? 'destructive'
                    : 'outline'
              }>
              {node.title}
            </Badge>{' '}
            {node.desc && (
              <span className="ml-2 italic text-sm text-muted-foreground">{node.desc}</span>
            )}
          </div>
          {node.children && node.children.length > 0 && <ConditionTreeView nodes={node.children} />}
        </li>
      ))}
    </ul>
  );
};
