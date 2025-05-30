'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useDashboardState } from '@/hooks/use-dashboard';
import { buildTextAgentAction } from '@/lib/action.utils';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { Action } from '@getgrowly/core';

interface AgentActionProps {
  onAdd: (data: Action) => void;
}

export function AgentAction({ onAdd }: AgentActionProps) {
  const { selectedOrganization } = useDashboardState();
  const [agentPrompt, setAgentPrompt] = useState('');

  const handleAdd = () => {
    if (!selectedOrganization) {
      toast.error('Please select an organization');
      return;
    }
    onAdd(
      buildTextAgentAction({
        prompt: agentPrompt,
      })
    );
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="agentPrompt">Agent Prompt</Label>
        <Textarea
          id="agentPrompt"
          value={agentPrompt}
          onChange={e => setAgentPrompt(e.target.value)}
          placeholder="Enter the prompt for the agent"
          rows={3}
        />
      </div>
      <Button type="button" onClick={handleAdd} disabled={!agentPrompt}>
        <Plus className="mr-2 h-4 w-4" />
        Add Agent Action
      </Button>
    </div>
  );
}
