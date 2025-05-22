import Link from 'next/link';
import { ChevronRight, Cpu, FileText, Loader, MoreHorizontal, Power } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AggregatedAgent, Status } from '@getgrowly/core';
import { Agent } from '@getgrowly/core';
import { useEffect, useState } from 'react';
import { suiteCore } from '@/core/suite';
import { Skeleton } from '../ui/skeleton';
import moment from 'moment';
import { useDashboardState } from '@/hooks/use-dashboard';
import { toast } from 'react-toastify';
import { truncateString } from '@/lib/utils';

export const AgentCard = ({ agent }: { agent: Agent }) => {
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [loadingDuplicate, setLoadingDuplicate] = useState(false);
  const [agentDetails, setAgentDetails] = useState<AggregatedAgent | null>(null);

  const { selectedOrganization, fetchOrganizationAgents, fetchOrganizationAgentById } =
    useDashboardState();

  useEffect(() => {
    const fetchAgentDetails = async () => {
      try {
        setLoading(true);
        const agentDetails = await suiteCore.agents.getAggregatedAgent(agent.id);
        setAgentDetails(agentDetails);
      } catch (error) {
        console.error('Failed to fetch agent details:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgentDetails();
  }, [agent.id]);

  const handleDelete = async () => {
    try {
      setLoadingDelete(true);
      await suiteCore.db.agents.delete(agent.id);
      toast.success('Agent deleted successfully');
      await fetchOrganizationAgents();
    } catch (error) {
      console.error('Failed to delete agent:', error);
      toast.error('Failed to delete agent');
    } finally {
      setLoadingDelete(false);
    }
  };

  const handleDuplicate = async () => {
    try {
      if (!selectedOrganization) throw new Error('Organization not found');
      setLoadingDuplicate(true);
      const agentWithWorkflows = await fetchOrganizationAgentById(agent.id);
      if (!agentWithWorkflows) throw new Error('Agent not found');
      await suiteCore.agents.createOrUpdate(selectedOrganization.id, agentWithWorkflows, true);
      toast.success('Agent duplicated successfully');
      await fetchOrganizationAgents();
    } catch (error) {
      console.error('Failed to duplicate agent:', error);
      toast.error('Failed to duplicate agent');
    } finally {
      setLoadingDuplicate(false);
    }
  };

  return (
    <Card key={agent.id} className="overflow-hidden transition-all hover:shadow-md">
      {!loading && agentDetails ? (
        <CardContent className="p-6 pt-3">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center gap-3">
              <div>
                <h3 className="font-semibold h-[40px] flex items-center overflow-hidden">
                  {agent.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {agentDetails?.created_at ? moment(agentDetails.created_at).fromNow() : ''}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Open menu</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link href={`/dashboard/agents/${agent.id}`}>Edit</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDuplicate} disabled={loadingDuplicate}>
                  {loadingDuplicate ? (
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    'Duplicate'
                  )}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleDelete} disabled={loadingDelete}>
                  {loadingDelete ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : 'Delete'}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2 mb-4 h-[50px]">
            {truncateString(agent.description || '', 100) || 'No description provided'}
          </p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 p-2">
              <Power className="h-4 w-4 mb-1 text-muted-foreground" />
              <span className="text-xs font-medium">
                {agentDetails?.status === Status.Active ? 'Active' : 'Inactive'}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 p-2">
              <FileText className="h-4 w-4 mb-1 text-muted-foreground" />
              <span className="text-xs font-medium">{agentDetails?.workflows.length} Flows</span>
            </div>
            <div className="flex flex-col items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 p-2">
              <Cpu className="h-4 w-4 mb-1 text-muted-foreground" />
              <span className="text-xs font-medium">{agent.resources.length} Resources</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="px-2 py-0 text-xs">{agentDetails?.model.toUpperCase()}</Badge>
            {agentDetails?.workflows.length > 0 && (
              <Badge variant="outline" className="px-2 py-0 text-xs">
                {agentDetails?.workflows.length} workflows
              </Badge>
            )}
          </div>
        </CardContent>
      ) : (
        <div className="p-6">
          <Skeleton className="h-6 w-24" />
        </div>
      )}
      <CardFooter className="p-0">
        <Link href={`/dashboard/agents/${agent.id}`} className="w-full">
          <Button variant="ghost" className="w-full rounded-none h-10 justify-between border-t">
            Manage Agent
            <ChevronRight className="h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};
