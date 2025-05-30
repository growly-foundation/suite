'use client';

import { AgentForm } from '@/components/agents/agent-form';
import { AgentResources } from '@/components/agents/agent-resources';
import { AgentWorkflows } from '@/components/agents/agent-workflows';
import { IntegrationGuideDialog } from '@/components/steps/integration-guide-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { suiteCore } from '@/core/suite';
import { useDashboardState } from '@/hooks/use-dashboard';
import { ArrowLeft, Code, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { AggregatedAgent, Status } from '@getgrowly/core';

import { PaddingLayout } from '../../layout';

const DEFAULT_MODEL = 'gpt-4';

export default function AgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedOrganization } = useDashboardState();
  const router = useRouter();
  const [agent, setAgent] = useState<AggregatedAgent | null>(null);
  const [isIntegrationGuideOpen, setIsIntegrationGuideOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const paramsValue = React.use(params);

  const isNewAgent = paramsValue.id === 'new';

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
          const fetchedAgent = await suiteCore.agents.getAggregatedAgent(paramsValue.id);
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
  }, [selectedOrganization, isNewAgent, paramsValue.id]);

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
      console.log(error);
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
    <PaddingLayout>
      <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => router.push('/dashboard/agents')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">
            {isNewAgent ? 'Create Agent' : `Edit Agent: ${agent.name}`}
          </h1>
        </div>
        <Tabs defaultValue="details" className="space-y-4">
          <div className="flex items-center justify-between">
            {!isNewAgent && (
              <TabsList>
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="resources">Resources</TabsTrigger>
                <TabsTrigger value="workflows">Workflows</TabsTrigger>
                <TabsTrigger value="conversations">Conversations</TabsTrigger>
              </TabsList>
            )}
            <Button variant="outline" onClick={() => setIsIntegrationGuideOpen(true)}>
              <Code className="mr-2 h-4 w-4" />
              Integration Guide
            </Button>
          </div>
          <TabsContent value="details">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-5">
                  <div>
                    <CardTitle className="text-xl">Agent Details</CardTitle>
                    <CardDescription className="mt-2">
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
                <CardTitle className="text-xl">Activity Logs</CardTitle>
                <CardDescription>View this agent's activity history</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Activity logs will be available soon.
                </p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        <IntegrationGuideDialog
          open={isIntegrationGuideOpen}
          onOpenChange={setIsIntegrationGuideOpen}
          agent={agent}
        />
      </div>
    </PaddingLayout>
  );
}
