import { Agent, AggregatedWorkflow, Status } from '@getgrowly/core';
import Link from 'next/link';
import { Calendar, ChevronRight, Loader2, MoreHorizontal, Play, Square } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { suiteCore } from '@/core/suite';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useDashboardState } from '@/hooks/use-dashboard';

export const WorkflowCard = ({ workflow }: { workflow: AggregatedWorkflow }) => {
  const [loading, setLoading] = useState(false);
  const [loadingAgents, setLoadingAgents] = useState(false);
  const { fetchOrganizationWorkflowById, fetchOrganizationWorkflows } = useDashboardState();
  const [usedByAgents, setUsedByAgents] = useState<Agent[]>([]);

  const toggleWorkflowStatus = async () => {
    try {
      setLoading(true);
      await suiteCore.db.workflows.update(workflow.id, {
        status: workflow.status === 'active' ? 'inactive' : 'active',
      });
      await fetchOrganizationWorkflowById(workflow.id);
      setLoading(false);
      toast.success('Workflow status updated successfully');
    } catch (error) {
      toast.error('Failed to update workflow status');
    }
  };

  const handleDeleteWorkflow = async () => {
    setLoading(true);
    try {
      await suiteCore.db.workflows.delete(workflow.id);
      await fetchOrganizationWorkflows();
      toast.success('Workflow deleted successfully');
    } catch (error) {
      toast.error('Failed to delete workflow');
    } finally {
      setLoading(false);
    }
  };

  const handleDuplicateWorkflow = async () => {
    try {
      setLoading(true);
      await suiteCore.db.workflows.create({
        name: `${workflow.name} (Copy)`,
        description: workflow.description,
        status: Status.Inactive,
        organization_id: workflow.organization_id,
      });
      await fetchOrganizationWorkflows();
      setLoading(false);
      toast.success('Workflow duplicated successfully');
    } catch (error) {
      toast.error('Failed to duplicate workflow');
    }
  };

  useEffect(() => {
    const fetchUsedByAgents = async () => {
      try {
        setLoadingAgents(true);
        const agentIds = await suiteCore.db.agent_workflows.getAllByFields({
          workflow_id: workflow.id,
        });
        const agents = await suiteCore.db.agents.getManyByIds(agentIds.map(id => id.agent_id));
        setUsedByAgents(agents);
      } catch (error) {
        console.error(error);
      } finally {
        setLoadingAgents(false);
      }
    };
    fetchUsedByAgents();
  }, [workflow.id]);

  return (
    <Card
      key={workflow.id}
      className="overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h3 className="font-medium text-lg tracking-tight">{workflow.name}</h3>
              <Badge
                variant={workflow.status === 'active' ? 'default' : 'secondary'}
                className="px-2 py-0.5 rounded-md font-medium uppercase text-[10px] tracking-wider">
                {workflow.status}
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              {workflow.description || 'No description provided'}
            </p>
            {loadingAgents ? (
              <div className="flex items-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading agents...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                {usedByAgents.length === 0 ? (
                  <span className="text-sm text-muted-foreground">Not used by any agents</span>
                ) : (
                  <span className="text-sm text-muted-foreground">Used by agents:</span>
                )}
                {usedByAgents.map(agent => (
                  <Link
                    key={agent.id}
                    href={`/dashboard/agents/${agent.id}`}
                    className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground hover:underline">
                      {agent.name}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={toggleWorkflowStatus}>
                {workflow.status === 'active' ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDuplicateWorkflow}>Duplicate</DropdownMenuItem>
              <DropdownMenuItem onClick={handleDeleteWorkflow}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-center gap-4 mt-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>Created {new Date(workflow.created_at).toLocaleDateString()}</span>
          </div>
          <div>{workflow.steps?.length || 0} steps</div>
        </div>
      </CardContent>
      <CardFooter className="bg-secondary px-6 py-3 flex justify-between">
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-primary hover:bg-blue-50/50 transition-colors"
          disabled={loading}
          onClick={toggleWorkflowStatus}>
          {workflow.status === 'active' ? (
            <>
              <Square className="mr-2 h-4 w-4" />
              Stop
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Run
            </>
          )}
        </Button>
        <Link href={`/dashboard/workflows/${workflow.id}`}>
          <Button
            variant="ghost"
            size="sm"
            className="hover:bg-blue-50/50 hover:text-primary transition-colors">
            Edit Workflow
            <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
