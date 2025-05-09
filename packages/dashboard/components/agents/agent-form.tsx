'use client';

import type React from 'react';

import { useState } from 'react';
import { PlusCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Agent, AggregatedAgent, Status, Workflow } from '@growly/core';
import { workflows } from '@/lib/data/mock';

// Available models for the agent
const availableModels = [
  { id: 'gpt-4', name: 'GPT-4', description: "OpenAI's most advanced model" },
  { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', description: 'Fast and efficient for most tasks' },
  {
    id: 'claude-3',
    name: 'Claude 3',
    description: "Anthropic's latest model with enhanced reasoning",
  },
  { id: 'claude-2', name: 'Claude 2', description: 'Balanced performance and efficiency' },
  { id: 'llama-3', name: 'Llama 3', description: "Meta's open model with strong capabilities" },
  { id: 'mistral-large', name: 'Mistral Large', description: 'Powerful open-weight model' },
];

interface AgentFormProps {
  agent: AggregatedAgent;
  onSave: (agent: Agent) => void;
}

export function AgentForm({ agent, onSave }: AgentFormProps) {
  const [formData, setFormData] = useState<AggregatedAgent>({ ...agent });
  const [newResource, setNewResource] = useState('');

  // Filter workflows to only show those from the agent's organization
  const organizationWorkflows = workflows.filter(
    workflow => workflow.organization_id === formData.organization_id
  );

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

  const toggleWorkflow = (workflowId: string) => {
    setFormData(prev => {
      if (prev.workflows.includes(workflowId)) {
        return {
          ...prev,
          workflows: prev.workflows.filter(id => id !== workflowId),
        };
      } else {
        return {
          ...prev,
          workflows: [...prev.workflows, workflowId],
        };
      }
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                    <div className="flex flex-col">
                      <span className="font-medium">{model.name}</span>
                      <span className="text-xs text-muted-foreground">{model.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            placeholder="Describe what this agent does"
            rows={3}
            className="bg-gray-50 dark:bg-gray-900"
          />
        </div>

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
          <p className="text-sm text-muted-foreground mb-2">Assign workflows to this agent</p>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {organizationWorkflows.length === 0 ? (
              <p className="text-sm text-muted-foreground">No workflows available</p>
            ) : (
              organizationWorkflows.map(workflow => (
                <div
                  key={workflow.id}
                  className={`p-3 rounded-md border cursor-pointer transition-all ${
                    formData.workflows.includes(workflow.id)
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-900'
                  }`}
                  onClick={() => toggleWorkflow(workflow.id)}>
                  <div className="font-medium">{workflow.name}</div>
                  {workflow.description && (
                    <div className="text-xs text-muted-foreground mt-1">{workflow.description}</div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Cancel
        </Button>
        <Button type="submit">Save Agent</Button>
      </div>
    </form>
  );
}
