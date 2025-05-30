'use client';

import { AgentsList } from '@/components/agents/agent-list';
import { Button } from '@/components/ui/button';
import { useDashboardState } from '@/hooks/use-dashboard';
import { PlusCircle } from 'lucide-react';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useEffect } from 'react';

import { PaddingLayout } from '../layout';

const AnimatedLoadingSmall = dynamic(
  () =>
    import('@/components/animated-components/animated-loading-small').then(
      module => module.AnimatedLoadingSmall
    ),
  { ssr: false }
);

export default function AgentsPage() {
  const { agentStatus, fetchOrganizationAgents, organizationAgents, selectedOrganization } =
    useDashboardState();

  useEffect(() => {
    fetchOrganizationAgents();
  }, [fetchOrganizationAgents, selectedOrganization]);

  return (
    <PaddingLayout>
      <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-semibold tracking-tight">Agents</h2>
            <p className="text-sm text-muted-foreground">
              View and manage your organization&apos;s AI agents
            </p>
          </div>
          <Link href="/dashboard/agents/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Agent
            </Button>
          </Link>
        </div>
        {agentStatus === 'loading' ? (
          <AnimatedLoadingSmall />
        ) : (
          <AgentsList agents={organizationAgents} />
        )}
      </div>
    </PaddingLayout>
  );
}
