'use client';

import { StepNode } from '@/components/steps/step-node';
import { useWorkflowDetailStore } from '@/hooks/use-workflow-details';
import { getLayoutedElements, getStepConditionEdges } from '@/lib/workflow.utils';
import { Loader2 } from 'lucide-react';
import type React from 'react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import ReactFlow, {
  Background,
  Controls,
  type Edge,
  type Node,
  Panel,
  Position,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { ExploreTemplateDialog } from '../steps/explore-template-dialog';
import { Button } from '../ui/button';

enum LayoutDirection {
  Vertical = 'TB',
  Horizontal = 'LR',
}

export function WorkflowCanvas({ onReset }: { onReset: () => void }) {
  const { workflow, setWorkflow } = useWorkflowDetailStore();
  const { fitView } = useReactFlow();
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [isResetting, setIsResetting] = useState(false);
  const [isExploreTemplateOpen, setIsExploreTemplateOpen] = useState(false);

  // Convert workflow steps to ReactFlow nodes and edges
  useEffect(() => {
    if (!workflow || !workflow.steps) return;
    // Create nodes from steps
    const flowNodes: Node[] = workflow.steps.map((step, index) => ({
      id: step.id,
      type: 'step',
      position: { x: 250 * index, y: 100 * index },
      data: { step, workflow },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
    }));

    // Create edges from step conditions
    let flowEdges: Edge[] = [];
    workflow.steps.forEach(step => {
      const stepEdges = getStepConditionEdges(step, workflow.steps);
      flowEdges = [...flowEdges, ...stepEdges];
    });

    const layouted = getLayoutedElements(flowNodes, flowEdges, {
      direction: LayoutDirection.Horizontal,
    });
    setNodes(layouted.nodes);
    setEdges(layouted.edges);
  }, [workflow, setNodes, setEdges]);

  // Update workflow when nodes change
  const onNodeDragStop = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      // Update node positions in the workflow
      const updatedNodes = nodes.map(n => {
        if (n.id === node.id) {
          return { ...n, position: node.position };
        }
        return n;
      });
      setNodes(updatedNodes);
    },
    [nodes, setNodes]
  );

  const onLayout = useCallback(
    (direction: LayoutDirection) => {
      const layouted = getLayoutedElements(nodes, edges, {
        direction,
      });
      setNodes([...layouted.nodes]);
      setEdges([...layouted.edges]);
      fitView();
    },
    [nodes, edges]
  );

  const nodeTypes = useMemo(
    () => ({
      step: StepNode(workflow?.id || ''),
    }),
    [workflow]
  );

  const handleReset = async () => {
    try {
      setIsResetting(true);
      onReset();
    } catch (error) {
      toast.error('Failed to reset workflow');
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <div
      className="h-[84vh] w-full border rounded-md bg-gray-50 dark:bg-gray-900"
      ref={reactFlowWrapper}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeDragStop={onNodeDragStop}
        nodeTypes={nodeTypes}
        fitView>
        <Background />
        <Controls />
        {/* Removed MiniMap as requested */}
        <Panel position="top-left" className="flex justify-between gap-2">
          <div className="flex items-center gap-2">
            <ExploreTemplateDialog
              open={isExploreTemplateOpen}
              onOpenChange={setIsExploreTemplateOpen}
              onSelectTemplate={template => {
                if (!workflow) return;
                setWorkflow({
                  ...workflow,
                  steps: template.steps,
                });
                setIsExploreTemplateOpen(false);
              }}
            />
            <Button disabled={isResetting} variant="outline" size={'sm'} onClick={handleReset}>
              {isResetting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : 'Reset'}
            </Button>
            <Button
              onClick={() => onLayout(LayoutDirection.Vertical)}
              size={'sm'}
              variant="outline">
              Vertical Layout
            </Button>
            <Button
              onClick={() => onLayout(LayoutDirection.Horizontal)}
              size={'sm'}
              variant="outline">
              Horizontal Layout
            </Button>
          </div>
        </Panel>
      </ReactFlow>
    </div>
  );
}
