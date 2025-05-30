'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useWorkflowDetailStore } from '@/hooks/use-workflow-details';
import { getConditionDescription } from '@/lib/workflow.utils';
import { Bot, Zap } from 'lucide-react';
import React, { useState } from 'react';
import { Handle, type NodeProps, Position } from 'reactflow';

import type { Action, ParsedStep, WorkflowId } from '@getgrowly/core';

import { AddStepDrawer } from './add-step-drawer';

export const StepNode =
  (workflowId: WorkflowId) =>
  ({ data }: NodeProps) => {
    const { step } = data as { step: ParsedStep };
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const { updateStep, deleteStep } = useWorkflowDetailStore();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isEditOpen, setIsEditOpen] = useState(false);

    // Determine the icon based on the action type
    const getActionIcon = (action: Action) => {
      if (!action) return <Zap className="h-4 w-4" />;

      if (typeof action === 'object' && 'type' in action) {
        switch (action.type) {
          case 'agent':
            return <Bot className="h-4 w-4" />;
          case 'text':
            return <Zap className="h-4 w-4" />;
          default:
            return <Zap className="h-4 w-4" />;
        }
      }
      return <Zap className="h-4 w-4" />;
    };

    // Get condition description
    const getConditionDescriptions = () => {
      if (!step.conditions) return ['No conditions'];
      return step.conditions.map(getConditionDescription);
    };

    // Get action descriptions
    const getActionDescriptions = () => {
      if (!step.action) return ['No actions'];
      return step.action.map(action => {
        if (action.type === 'text') {
          const text = action.return?.text || '';
          return `Text: ${text.substring(0, 30)}${text.length > 30 ? '...' : ''}`;
        } else if (action.type === 'agent') {
          return `Agent: ${action.args?.prompt || 'Unknown'}`;
        }
        return 'Unknown action';
      });
    };

    const handleDelete = () => {
      deleteStep(step.id);
    };

    const handleEdit = () => {
      setIsEditOpen(true);
    };

    const conditionDescriptions = getConditionDescriptions();
    const actionDescriptions = getActionDescriptions();

    return (
      <React.Fragment>
        <Handle type="target" position={Position.Left} />
        <Card className="w-[500px] shadow-md">
          <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              {Array.isArray(step.action) && step.action.length > 0 ? (
                getActionIcon(step.action[0])
              ) : (
                <Zap className="h-4 w-4" />
              )}
              {step.name}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant={step.is_beast_mode ? 'default' : 'outline'} className="text-xs">
                {step.is_beast_mode ? 'Beast Mode' : 'Normal'}
              </Badge>
              <Badge
                variant={step.status === 'active' ? 'default' : 'secondary'}
                className="text-xs">
                {step.status}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-4 pt-2 text-xs">
            <p className="text-xs text-muted-foreground">ID: {step.id}</p>
            <p className="text-muted-foreground line-clamp-2">
              {step.description || 'No description provided'}
            </p>
            <div className="mt-3 space-y-2">
              <div>
                <span className="font-medium">Conditions:</span>
                <div className="mt-1 space-y-1">
                  {conditionDescriptions.map((desc, i) => (
                    <div
                      key={i}
                      className="mr-1 rounded-sm border px-2 py-1 text-xs font-normal text-muted-foreground">
                      {desc}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <span className="font-medium">Actions:</span>
                <div className="mt-1 space-y-1">
                  {actionDescriptions.map((desc, i) => (
                    <div
                      key={i}
                      className="mr-1 rounded-sm border px-2 py-1 text-xs font-normal text-muted-foreground">
                      {desc}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="p-2 flex justify-end gap-2 border-t">
            <Button variant="outline" size="sm" onClick={handleEdit}>
              Edit
            </Button>
            <Button variant="outline" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </CardFooter>
        </Card>
        <Handle type="source" position={Position.Right} />
        <AddStepDrawer
          open={isEditOpen}
          onOpenChange={setIsEditOpen}
          onAdd={updateStep}
          workflowId={workflowId}
          defaultStep={step}
        />
      </React.Fragment>
    );
  };
