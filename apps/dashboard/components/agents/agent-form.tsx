'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { availableModels } from '@/constants/agents';
import { useDashboardState } from '@/hooks/use-dashboard';
import { Loader, PlusCircle, X } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { AggregatedAgent, Status, Workflow } from '@getgrowly/core';

import { WorkflowSmallCard } from '../workflows/workflow-small-card';
import { AgentModelCard } from './agent-model-card';

interface AgentFormProps {
  agent: AggregatedAgent;
  onSave: (agent: AggregatedAgent) => Promise<void>;
}

export function AgentForm({ agent, onSave }: AgentFormProps) {
  const { organizationWorkflows, fetchOrganizationWorkflows } = useDashboardState();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<AggregatedAgent>({
    ...agent,
    model: agent.model || availableModels[0].id,
  });
  const [newResource, setNewResource] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleStatusChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      status: checked ? Status.Active : Status.Inactive,
    }));
  };

  const handleModelChange = (value: string) => {
    setFormData(prev => ({ ...prev, model: value }));
  };

  const addResource = () => {
    if (newResource.trim()) {
      setFormData(prev => ({
        ...prev,
        resources: [...prev.resources, newResource.trim()],
      }));
      setNewResource('');
    }
  };

  const removeResource = (index: number) => {
    setFormData(prev => ({
      ...prev,
      resources: prev.resources.filter((_, i) => i !== index),
    }));
  };

  const toggleWorkflow = (workflow: Workflow) => {
    setFormData(prev => {
      if (prev.workflows.some(w => w.id === workflow.id)) {
        return {
          ...prev,
          workflows: prev.workflows.filter(w => w.id !== workflow.id),
        };
      } else {
        return {
          ...prev,
          workflows: [...prev.workflows, workflow],
        };
      }
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    try {
      setIsSaving(true);
      e.preventDefault();
      await onSave(formData);
    } catch (error: any) {
      console.log(error);
      toast.error(`Failed to save agent: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    fetchOrganizationWorkflows();
  }, []);

  return (
    <div>
      <div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="Agent name"
              required
              className="bg-gray-50 dark:bg-gray-900"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">Model</Label>
            <Select value={formData.model} onValueChange={handleModelChange}>
              <SelectTrigger className="bg-gray-50 dark:bg-gray-900">
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {availableModels.map(model => (
                  <SelectItem key={model.id} value={model.id}>
                    <AgentModelCard model={model} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <br />
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <p className="text-sm text-muted-foreground">
            The description should provide a brief overview of the agent's purpose and capabilities.
          </p>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            placeholder="Describe what this agent does"
            style={{
              fontSize: '14px',
            }}
            rows={5}
            className="bg-gray-50 dark:bg-gray-900"
          />
        </div>
        <br />
        <div className="flex items-center space-x-2 bg-gray-50 dark:bg-gray-900 p-3 rounded-md">
          <Switch
            id="status"
            checked={formData.status === Status.Active}
            onCheckedChange={handleStatusChange}
          />
          <Label htmlFor="status" className="font-medium">
            {formData.status === Status.Active ? 'Active' : 'Inactive'}
          </Label>
          <span className="text-xs text-muted-foreground ml-2">
            {formData.status === Status.Active
              ? 'Agent is currently active and processing requests'
              : 'Agent is inactive and not processing requests'}
          </span>
        </div>
      </div>

      <br />
      <div className="space-y-4">
        <div>
          <Label className="text-base">Resources</Label>
          <p className="text-sm text-muted-foreground mb-2">
            Add resources that this agent can access
          </p>

          <div className="flex space-x-2 mb-2">
            <Input
              value={newResource}
              onChange={e => setNewResource(e.target.value)}
              placeholder="Add a resource"
              className="flex-1 bg-gray-50 dark:bg-gray-900"
            />
            <Button type="button" onClick={addResource} size="sm" variant="secondary">
              <PlusCircle className="h-4 w-4 mr-1" /> Add
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {formData.resources.length === 0 ? (
              <p className="text-sm text-muted-foreground">No resources added</p>
            ) : (
              formData.resources.map((resource, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="flex items-center gap-1 px-3 py-1">
                  {resource}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-4 w-4 p-0 ml-1"
                    onClick={() => removeResource(index)}>
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove</span>
                  </Button>
                </Badge>
              ))
            )}
          </div>
        </div>
        <div>
          <Label className="text-base">Workflows</Label>
          <p className="text-sm text-muted-foreground mb-2"></p>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {organizationWorkflows.length === 0 ? (
              <p className="text-sm text-muted-foreground">No workflows available</p>
            ) : (
              organizationWorkflows.map(workflow => (
                <WorkflowSmallCard
                  workflow={workflow}
                  isSelected={formData.workflows.some(w => w.id === workflow.id)}
                  onClick={toggleWorkflow}
                />
              ))
            )}
          </div>
        </div>
      </div>
      <br />
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit" onClick={handleSubmit} disabled={isSaving || !formData.name}>
          {isSaving ? 'Saving...' : 'Save Agent'}
          {isSaving && <Loader className="ml-2 h-4 w-4 animate-spin" />}
        </Button>
      </div>
    </div>
  );
}
