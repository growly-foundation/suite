'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useDashboardState } from '@/hooks/use-dashboard';
import { Loader2, Plus } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';

import { AggregatedAgent, Workflow } from '@getgrowly/core';

import { NewWorkflowButton } from '../buttons/new-workflow-button';
import { WorkflowCard } from '../workflows/workflow-card';
import { WorkflowSmallCard } from '../workflows/workflow-small-card';

interface AgentWorkflowsProps {
  agent: AggregatedAgent;
  onUpdate: (agent: AggregatedAgent) => Promise<void>;
}

export function AgentWorkflows({ agent, onUpdate }: AgentWorkflowsProps) {
  const { organizationWorkflows } = useDashboardState();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkflows, setSelectedWorkflows] = useState<Workflow[]>([...agent.workflows]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Filter workflows by organization and search query.
  const filteredWorkflows = organizationWorkflows.filter(
    workflow =>
      workflow.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (workflow.description &&
        workflow.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSaveWorkflows = async () => {
    setIsSaving(true);
    try {
      const updatedAgent = {
        ...agent,
        workflows: selectedWorkflows,
      };
      await onUpdate(updatedAgent);
    } catch (error) {
      toast.error('Failed to update agent workflows');
    }
    setIsDialogOpen(false);
    setIsSaving(false);
  };

  // Get assigned workflows.
  const assignedWorkflows = organizationWorkflows.filter(w =>
    agent.workflows.some(workflow => w.id === workflow.id)
  );

  const isWorkflowAssigned = (workflowId: string) =>
    selectedWorkflows.some(w => w.id === workflowId);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-xl">Assigned Workflows</CardTitle>
          <CardDescription className="mt-1">
            Manage the workflows this agent can execute
          </CardDescription>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button disabled={isSaving}>
              <Plus className="mr-2 h-4 w-4" />
              Assign Workflows
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>Assign Workflows</DialogTitle>
              <DialogDescription>
                Select workflows to assign to this agent. The agent will be able to execute these
                workflows.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4 space-y-4">
              <Input
                placeholder="Search workflows..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="mb-4"
              />
              <ScrollArea className="h-[300px] pr-4">
                {filteredWorkflows.length === 0 ? (
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No workflows found
                    </p>
                    <NewWorkflowButton />
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredWorkflows.map(workflow => (
                      <WorkflowSmallCard
                        key={workflow.id}
                        isSelected={isWorkflowAssigned(workflow.id)}
                        workflow={workflow}
                        onClick={() => {
                          let updatedWorkflows = selectedWorkflows;
                          if (isWorkflowAssigned(workflow.id)) {
                            updatedWorkflows = selectedWorkflows.filter(w => w.id !== workflow.id);
                          } else {
                            updatedWorkflows = [...selectedWorkflows, workflow];
                          }
                          setSelectedWorkflows(updatedWorkflows);
                        }}
                      />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveWorkflows} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSaving ? 'Saving...' : 'Save'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {assignedWorkflows.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No workflows assigned to this agent</p>
            <Button variant="outline" className="mt-4" onClick={() => setIsDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Assign Workflows
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {assignedWorkflows.map(workflow => (
              <WorkflowCard workflow={workflow} key={workflow.id} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
