'use client';

import { AgentConversations } from '@/components/agents/agent-conversations';
import { AgentDetails } from '@/components/agents/agent-details';
import { AgentResources } from '@/components/agents/agent-resources';
import { AgentUsers } from '@/components/agents/agent-users';
import { AgentWorkflows } from '@/components/agents/agent-workflows';
import { IntegrationGuideDialog } from '@/components/steps/integration-guide-dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { suiteCore } from '@/core/suite';
import { useDashboardState } from '@/hooks/use-dashboard';
import { Code, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { AggregatedAgent, Status } from '@getgrowly/core';

const DEFAULT_MODEL = 'gpt-4';

export default function AgentPage({ params }: { params: Promise<{ id: string }> }) {
  const { selectedOrganization, setSelectedAgent } = useDashboardState();
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
            setSelectedAgent(fetchedAgent);
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
    <div className="flex flex-col">
      <Tabs defaultValue="details">
        <div className="flex items-center justify-between border-b p-3">
          {!isNewAgent && (
            <TabsList>
              <TabsTrigger value="details">Details</TabsTrigger>
              <TabsTrigger value="conversations">Conversations</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="workflows">Workflows</TabsTrigger>
            </TabsList>
          )}
          <Button
            className="rounded-full"
            variant="outline"
            onClick={() => setIsIntegrationGuideOpen(true)}>
            <Code className="mr-2 h-4 w-4" />
            Integration Guide
          </Button>
        </div>
        <TabsContent value="details">
          <AgentDetails agent={agent} onSave={handleAgentUpdate} />
        </TabsContent>
        <TabsContent value="conversations" className="mt-0">
          <AgentConversations agent={agent} />
        </TabsContent>
        <TabsContent value="users">
          <AgentUsers />
        </TabsContent>
        <TabsContent value="workflows">
          <AgentWorkflows agent={agent} onUpdate={handleAgentUpdate} />
        </TabsContent>
        <TabsContent value="resources">
          <AgentResources />
        </TabsContent>
      </Tabs>
      <IntegrationGuideDialog
        open={isIntegrationGuideOpen}
        onOpenChange={setIsIntegrationGuideOpen}
        agent={agent}
      />
    </div>
  );
}
