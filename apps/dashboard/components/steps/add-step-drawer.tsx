'use client';

import { ActionForm } from '@/components/steps/actions/action-form';
import { ConditionForm } from '@/components/steps/conditions/condition-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useWorkflowDetailStore } from '@/hooks/use-workflow-details';
import { ZapIcon } from 'lucide-react';
import { useState } from 'react';
import { v4 as uuid } from 'uuid';

import {
  Action,
  Condition,
  ParsedStep,
  ParsedStepInsert,
  Status,
  WithId,
  WorkflowId,
} from '@getgrowly/core';

import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '../ui/resizable';
import { Switch } from '../ui/switch';

interface AddStepDrawerProps {
  defaultStep?: ParsedStep;
  workflowId: WorkflowId;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAdd: (step: WithId<ParsedStepInsert>) => void;
}

export function AddStepDrawer({
  defaultStep,
  workflowId,
  open,
  onOpenChange,
  onAdd,
}: AddStepDrawerProps) {
  const { getSteps } = useWorkflowDetailStore();
  const existingSteps = getSteps();

  const [name, setName] = useState(defaultStep?.name || '');
  const [description, setDescription] = useState(defaultStep?.description || '');
  const [conditions, setConditions] = useState<Condition[]>(defaultStep?.conditions || []);
  const [actions, setActions] = useState<Action[]>(defaultStep?.action || []);
  const [beastMode, setBeastMode] = useState(defaultStep?.is_beast_mode || false);
  const [status, setStatus] = useState(defaultStep?.status || Status.Active);

  const handleAdd = () => {
    onAdd({
      id: defaultStep?.id || uuid(),
      name,
      description,
      index: defaultStep ? defaultStep.index : existingSteps.length,
      status,
      workflow_id: workflowId,
      conditions: conditions,
      action: actions,
      is_beast_mode: beastMode,
    });
    resetForm();
  };

  const resetForm = () => {
    setName(defaultStep?.name || '');
    setDescription(defaultStep?.description || '');
    setConditions(defaultStep?.conditions || []);
    setActions(defaultStep?.action || []);
  };

  return (
    <Sheet
      open={open}
      onOpenChange={isOpen => {
        onOpenChange(isOpen);
        if (!isOpen) resetForm();
      }}>
      <SheetContent side="right" className="p-0 w-[650px] sm:max-w-[800px] h-full overflow-hidden">
        <ResizablePanelGroup direction="horizontal" className="h-full rounded-lg">
          <ResizableHandle withHandle className="w-2 bg-border" />
          <ResizablePanel defaultSize={100} className="p-6">
            <div className="h-full flex flex-col">
              <SheetHeader>
                <SheetTitle>{defaultStep ? 'Edit Step' : 'Add New Step'}</SheetTitle>
                <SheetDescription>
                  {defaultStep
                    ? 'Edit the step for your workflow. Steps can perform actions when conditions are met.'
                    : 'Create a new step for your workflow. Steps can perform actions when conditions are met.'}
                </SheetDescription>
              </SheetHeader>
              <br />
              <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Step Name</Label>
                    <Input
                      id="name"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Enter step name"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description (Optional)</Label>
                    <Input
                      id="description"
                      value={description}
                      onChange={e => setDescription(e.target.value)}
                      placeholder="Describe what this step does"
                    />
                  </div>
                  {/* Conditions Section */}
                  <ConditionForm conditions={conditions} setConditions={setConditions} />
                  <Separator />
                  {/* Actions Section */}
                  <ActionForm actions={actions} setActions={setActions} />
                  <Separator />
                  {/* Status */}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="status">Status</Label>
                    <Switch
                      id="status"
                      checked={status === Status.Active}
                      onCheckedChange={value => setStatus(value ? Status.Active : Status.Inactive)}
                    />
                  </div>
                  <Separator />
                  {/* Beast Mode */}
                  <div className="flex items-center justify-between">
                    <Label htmlFor="beast-mode" className="flex items-center gap-2">
                      <ZapIcon className="h-4 w-4" />
                      Beast Mode
                    </Label>
                    <Switch id="beast-mode" checked={beastMode} onCheckedChange={setBeastMode} />
                  </div>
                </div>
              </div>
              <div className="py-4 mt-4 border-t">
                <SheetFooter>
                  <Button variant="outline" onClick={() => onOpenChange(false)}>
                    Cancel
                  </Button>
                  <Button
                    onClick={handleAdd}
                    disabled={!name || conditions.length === 0 || actions.length === 0}>
                    {defaultStep ? 'Update Step' : 'Create Step'}
                  </Button>
                </SheetFooter>
              </div>
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      </SheetContent>
    </Sheet>
  );
}
