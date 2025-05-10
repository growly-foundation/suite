'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AggregatedAgent, Status } from '@growly/core';
import { AgentForm } from '@/components/agents/agent-form';
import { AgentWorkflows } from '@/components/agents/agent-workflows';
import { AgentResources } from '@/components/agents/agent-resources';
import { useDashboardState } from '@/hooks/use-dashboard';
import { suiteCore } from '@/core/suite';
import { toast } from 'react-toastify';
import { AgentAvatar } from '@/components/agents/agent-avatar';

const DEFAULT_MODEL = 'gpt-4';

export default function AgentPage({ params }: { params: { id: string } }) {
  const { selectedOrganization } = useDashboardState();
  const router = useRouter();
  const [agent, setAgent] = useState<AggregatedAgent | null>(null);
  const [loading, setLoading] = useState(true);

  const isNewAgent = params.id === 'new';

  useEffect(() => {
    const fetchAgent = async () => {
      setLoading(true);
      if (!selectedOrganization) return;
      if (isNewAgent) {
        setAgent({
          id: '',
          name: '',
          model: DEFAULT_MODEL,
          description: '',
          organization_id: selectedOrganization.id,
          resources: [],
          workflows: [],
          status: Status.Active,
          created_at: new Date().toISOString(),
        });
      } else {
        try {
          const fetchedAgent = await suiteCore.agents.getAggregatedAgent(params.id);
          if (fetchedAgent) {
            setAgent(fetchedAgent);
          } else {
            // Handle agent not found
            router.push('/dashboard/agents');
          }
        } catch (error) {
          toast.error('Failed to fetch agent');
          router.push('/dashboard/agents');
        }
      }
      setLoading(false);
    };
    fetchAgent();
  }, [selectedOrganization, isNewAgent]);

  const handleAgentUpdate = async (updatedAgent: AggregatedAgent) => {
    try {
      if (!selectedOrganization) return;
      const agent = await suiteCore.agents.createOrUpdate(
        selectedOrganization.id,
        updatedAgent,
        isNewAgent
      );
      setAgent(agent);
      toast.success(isNewAgent ? 'Agent created successfully' : 'Agent updated successfully');
      if (!isNewAgent) {
        router.push(`/dashboard/agents/${updatedAgent.id}`);
      } else {
        router.push('/dashboard/agents');
      }
    } catch (error) {
      toast.error('Failed to update agent');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader className="animate-spin" />
      </div>
    );
  }

  if (!agent) {
    toast.error('Agent not found');
    router.push('/dashboard/agents');
    return <></>;
  }

  return (
    <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/agents')}>
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-2xl font-bold">
          {isNewAgent ? 'Create Agent' : `Edit Agent: ${agent.name}`}
        </h1>
      </div>

      <Tabs defaultValue="details" className="space-y-4">
        {!isNewAgent && (
          <TabsList>
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="workflows">Workflows</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
          </TabsList>
        )}
        <TabsContent value="details">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-5">
                {!isNewAgent && <AgentAvatar agent={agent} width={60} height={60} />}
                <div>
                  <CardTitle>Agent Details</CardTitle>
                  <CardDescription>
                    Manage your agent's basic information and settings
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <AgentForm agent={agent} onSave={handleAgentUpdate} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="workflows">
          <AgentWorkflows agent={agent} onUpdate={handleAgentUpdate} />
        </TabsContent>
        <TabsContent value="resources">
          <AgentResources agent={agent} onUpdate={handleAgentUpdate} />
        </TabsContent>
        <TabsContent value="logs">
          <Card>
            <CardHeader>
              <CardTitle>Activity Logs</CardTitle>
              <CardDescription>View this agent's activity history</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Activity logs will be available soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
