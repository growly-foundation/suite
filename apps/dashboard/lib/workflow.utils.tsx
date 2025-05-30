import Dagre from '@dagrejs/dagre';
import { BotIcon, FileTextIcon } from 'lucide-react';
import { Edge, MarkerType, Node } from 'reactflow';

import {
  Action,
  type Condition,
  ConditionType,
  type ParsedStep,
  ScalarCondition,
  UIEventCondition,
} from '@getgrowly/core';

export type ConditionItemNode = {
  title: string;
  desc?: string;
  status: 'success' | 'error' | 'pending';
  children?: ConditionItemNode[];
};

// Helper function to extract step IDs from conditions
export function extractStepIdsFromConditions(condition: Condition): string[] {
  if (!condition) return [];

  // If conditions is a boolean, there are no step dependencies
  if (condition.type === ConditionType.Always) return [];

  // If conditions is a string, it might be a step ID
  if (condition.type === ConditionType.Step) return [condition.data];

  // If conditions is an object with type 'and' or 'or'
  if (condition.type === ConditionType.Or || condition.type === ConditionType.And) {
    return condition.data.flatMap((condition: ScalarCondition) =>
      extractStepIdsFromConditions(condition)
    );
  }

  // If it's a judgedByAgent condition
  if (condition.type === ConditionType.JudgedByAgent && condition.data && condition.data.stepId) {
    return [condition.data.stepId];
  }
  return [];
}

export const getConditionLabel = (
  condition: Condition,
  existingSteps: ParsedStep[]
): ConditionItemNode[] => {
  switch (condition.type) {
    case ConditionType.Always:
      return [{ title: 'Always', desc: 'Step is always executed', status: 'success' }];
    case ConditionType.Step:
      const step = existingSteps.find(s => s.id === condition.data);
      return step
        ? [
            {
              title: 'After step',
              desc: `Step ${step.name} must be completed`,
              status: 'success',
            },
          ]
        : [
            {
              title: 'After step',
              desc: `No step with id ${condition.data}`,
              status: 'error',
            },
          ];
    case ConditionType.Workflow:
      return [
        {
          title: 'After workflow',
          desc: `Workflow ${condition.data} must be completed`,
          status: 'pending',
        },
      ];
    case ConditionType.UIEvent:
      return [{ title: 'UI Event', desc: getUIEventLabel(condition.data), status: 'pending' }];
    case ConditionType.JudgedByAgent:
      return [{ title: 'Judged by Agent', desc: 'Agent must judge the step', status: 'pending' }];
    case ConditionType.Or:
      return [
        {
          title: 'Or',
          desc: 'Any of the following conditions are true',
          children: condition.data
            .map((condition: ScalarCondition) => getConditionLabel(condition, existingSteps))
            .flat(),
          status: 'pending',
        },
      ];
    case ConditionType.And:
      return [
        {
          title: 'And',
          desc: 'All of the following conditions are true',
          children: condition.data
            .map((condition: ScalarCondition) => getConditionLabel(condition, existingSteps))
            .flat(),
          status: 'pending',
        },
      ];
    default:
      return [{ title: 'Unknown condition', status: 'error' }];
  }
};

export const getUIEventLabel = (eventType: UIEventCondition): string => {
  switch (eventType) {
    case UIEventCondition.OnPageLoad:
      return 'When the page is loaded';
    case UIEventCondition.OnVisited:
      return 'When a specified element is visited';
    case UIEventCondition.OnClicked:
      return 'When a specified element is clicked';
    case UIEventCondition.OnHovered:
      return 'When a specified element is hovered';
    default:
      return eventType;
  }
};

export const getActionLabel = (
  action: Action
): {
  icon?: React.ReactNode;
  title: string;
  content: React.ReactNode;
} => {
  if (action.type === 'text') {
    return {
      icon: <FileTextIcon className="h-4 w-4" />,
      title: 'Text',
      content: action.return?.text,
    };
  } else if (action.type === 'agent') {
    return {
      icon: <BotIcon className="h-4 w-4" />,
      title: 'Agent',
      content: action.args?.prompt,
    };
  }
  return {
    title: 'Unknown',
    content: 'Unknown action',
  };
};

// Get a human-readable description of the condition
export function getConditionDescription(condition: Condition): React.ReactNode {
  switch (condition.type) {
    case ConditionType.Always:
      return 'Always';
    case ConditionType.Step:
      return `After step: ${condition.data}`;
    case ConditionType.Workflow:
      return `After workflow: ${condition.data}`;
    case ConditionType.UIEvent:
      switch (condition.data) {
        case UIEventCondition.OnPageLoad:
          return 'On Page Load';
        case UIEventCondition.OnVisited:
          return 'On Visited';
        case UIEventCondition.OnClicked:
          return 'On Clicked';
        case UIEventCondition.OnHovered:
          return 'On Hovered';
        default:
          return 'UI Event';
      }
    case ConditionType.JudgedByAgent:
      return 'Judged by Agent';
    case ConditionType.Or:
      return condition.data.map(getConditionDescription).join(' OR ');
    case ConditionType.And:
      return condition.data.map(getConditionDescription).join(' AND ');
    default:
      return 'Unknown';
  }
}

// Create edges based on step conditions
export function getStepConditionEdges(step: ParsedStep, allSteps: ParsedStep[]): Edge[] {
  const edges: Edge[] = [];

  // Extract step IDs from conditions
  const dependencyIds = step.conditions.flatMap(extractStepIdsFromConditions);

  // Create an edge for each dependency
  dependencyIds.forEach(sourceId => {
    // Check if the source step exists
    const sourceStep = allSteps.find(s => s.id === sourceId);
    if (sourceStep) {
      edges.push({
        id: `${sourceId}-${step.id}`,
        source: sourceId,
        target: step.id,
        markerEnd: {
          type: MarkerType.ArrowClosed,
        },
        style: { stroke: '#555' },
        label: step.conditions.map(getConditionDescription).join(', '),
      });
    }
  });

  return edges;
}

export const getLayoutedElements = (
  nodes: Node[],
  edges: Edge[],
  options: { direction: 'TB' | 'BT' | 'LR' | 'RL' }
) => {
  const g = new Dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
  g.setGraph({ rankdir: options.direction });

  const nodeWidth = 600;
  const nodeHeight = 600;

  edges.forEach(edge => g.setEdge(edge.source, edge.target));
  nodes.forEach(node =>
    g.setNode(node.id, {
      ...node,
      width: nodeWidth,
      height: nodeHeight,
    })
  );

  Dagre.layout(g);

  return {
    nodes: nodes.map(node => {
      const position = g.node(node.id);
      // We are shifting the dagre node position (anchor=center center) to the top left
      // so it matches the React Flow node anchor point (top left).
      const x = position.x - nodeWidth / 2;
      const y = position.y - nodeHeight / 2;

      return { ...node, position: { x, y } };
    }),
    edges,
  };
};
