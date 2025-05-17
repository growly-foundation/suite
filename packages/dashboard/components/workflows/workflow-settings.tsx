'use client';

import type React from 'react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { suiteCore } from '@/core/suite';
import { toast } from 'react-toastify';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Status } from '@getgrowly/core';
import { useWorkflowDetailStore } from '@/hooks/use-workflow-details';

export function WorkflowSettings() {
  const { workflow, setWorkflow } = useWorkflowDetailStore();
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (!workflow) return;
    setWorkflow({ ...workflow, [name]: value });
  };

  const handleStatusChange = (checked: boolean) => {
    if (!workflow) return;
    setWorkflow({ ...workflow, status: checked ? Status.Active : Status.Inactive });
  };

  const handleDeleteWorkflow = async () => {
    setIsLoading(true);
    try {
      if (!workflow) return;
      await suiteCore.db.workflows.delete(workflow.id);
      toast.success('Workflow deleted successfully');
      router.push('/dashboard/workflows');
    } catch (error) {
      toast.error('Failed to delete workflow');
    } finally {
      setIsLoading(false);
    }
  };

  if (!workflow) {
    return <div>Workflow not found</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Workflow Settings</CardTitle>
        <CardDescription>Configure the basic settings for your workflow</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">Workflow Name</Label>
          <Input
            id="name"
            name="name"
            value={workflow.name}
            onChange={handleInputChange}
            placeholder="Enter workflow name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (optional)</Label>
          <Textarea
            id="description"
            name="description"
            value={workflow.description || ''}
            onChange={handleInputChange}
            placeholder="Describe what this workflow does"
            rows={4}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="status"
            checked={workflow.status === Status.Active}
            onCheckedChange={handleStatusChange}
          />
          <Label htmlFor="status">
            {workflow.status === Status.Active ? 'Active' : 'Inactive'}
          </Label>
          <span className="text-sm text-muted-foreground ml-2">
            {workflow.status === Status.Active
              ? 'Workflow is currently active and processing'
              : 'Workflow is inactive and not processing'}
          </span>
        </div>

        <div className="pt-4 border-t">
          <h3 className="text-sm font-medium mb-2">Danger Zone</h3>
          <Button variant="destructive" onClick={handleDeleteWorkflow} disabled={isLoading}>
            {isLoading ? 'Deleting...' : 'Delete Workflow'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
