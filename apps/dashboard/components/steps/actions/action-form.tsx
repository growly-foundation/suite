'use client';

import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState } from 'react';

import { Action } from '@getgrowly/core';

import { ActionItem } from './action-item';
import { AgentAction } from './agent-action';
import { TextAction } from './text-action';

interface ActionFormProps {
  actions: Action[];
  setActions: (actions: Action[]) => void;
}

export function ActionForm({ actions, setActions }: ActionFormProps) {
  const [currentActionType, setCurrentActionType] = useState<'text' | 'agent'>('text');

  const addAction = (action: Action) => {
    setActions([...actions, action]);
  };

  const removeAction = (id: string) => {
    setActions(actions.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Label className="text-base font-medium">Actions</Label>
        <Badge variant="outline" className="font-normal">
          {actions.length} {actions.length === 1 ? 'action' : 'actions'}
        </Badge>
      </div>
      {actions.length > 0 && (
        <div className="space-y-2">
          {actions.map(action => (
            <ActionItem key={action.id} action={action} onRemove={removeAction} />
          ))}
        </div>
      )}
      <Tabs
        defaultValue="text"
        value={currentActionType}
        onValueChange={v => setCurrentActionType(v as 'text' | 'agent')}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="text">Text</TabsTrigger>
          <TabsTrigger value="agent">Agent</TabsTrigger>
        </TabsList>
        <TabsContent value="text">
          <TextAction onAdd={addAction} />
        </TabsContent>
        <TabsContent value="agent">
          <AgentAction onAdd={addAction} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
