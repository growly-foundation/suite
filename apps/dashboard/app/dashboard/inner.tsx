'use client';

import { NewAgentButton } from '@/components/buttons/new-agent-button';
import { NewWorkflowButton } from '@/components/buttons/new-workflow-button';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { suiteCore } from '@/core/suite';
import { useDashboardState } from '@/hooks/use-dashboard';
import {
  Activity as ActivityIcon,
  Bot,
  Loader,
  Settings2,
  Users,
  WorkflowIcon,
} from 'lucide-react';
import moment from 'moment';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

import { Status } from '@getgrowly/core';

import { Activity } from './activity-card';

const AnimatedLoadingSmall = dynamic(
  () =>
    import('@/components/animated-components/animated-loading-small').then(
      module => module.AnimatedLoadingSmall
    ),
  { ssr: false }
);

const MAX_RECENT_ACTIVITY = 10;

export default function DashboardInner() {
  const { selectedOrganization, setSelectedOrganization } = useDashboardState();
  const [showAllActivity, setShowAllActivity] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [metrics, setMetrics] = useState({
    totalAgents: 0,
    activeAgents: 0,
    totalWorkflows: 0,
    runningWorkflows: 0,
    resourceUsage: 0,
  });
  const [recentActivity, setRecentActivity] = useState<Activity[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
      if (!selectedOrganization) return;
      setLoading(true);

      try {
        // Fetch agents
        const agents = await suiteCore.db.agents.getAllByFields({
          organization_id: selectedOrganization.id,
        });
        const activeAgents = agents.filter(agent => agent.status === Status.Active);

        // Fetch workflows
        const workflows = await suiteCore.db.workflows.getAllByFields({
          organization_id: selectedOrganization.id,
        });
        const runningWorkflows = workflows.filter(workflow => workflow.status === Status.Active);

        setMetrics({
          totalAgents: agents.length,
          activeAgents: activeAgents.length,
          totalWorkflows: workflows.length,
          runningWorkflows: runningWorkflows.length,
          resourceUsage: Math.round((activeAgents.length / (agents.length || 1)) * 100),
        });

        // Get recent activity
        const activity = [
          ...agents.map(agent => ({
            type: 'agent' as const,
            title: `Agent "${agent.name}" ${agent.status === Status.Active ? 'activated' : 'deactivated'}`,
            timestamp: agent.created_at,
            icon: <Bot className="h-4 w-4 text-primary" />,
            color: 'bg-blue-100',
          })),
          ...workflows.map(workflow => ({
            type: 'workflow' as const,
            title: `Workflow "${workflow.name}" ${workflow.status === Status.Active ? 'started' : 'stopped'}`,
            timestamp: workflow.created_at,
            icon: <WorkflowIcon className="h-4 w-4 text-green-600" />,
            color: 'bg-green-100',
          })),
        ].sort((a, b) => moment(b.timestamp).unix() - moment(a.timestamp).unix());

        setRecentActivity(activity);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboardData();
  }, [selectedOrganization]);

  const handleDeleteOrganization = async () => {
    if (!selectedOrganization) return;
    setLoadingDelete(true);
    try {
      const isConfirmed = window.confirm(
        `Are you sure you want to delete organization ${selectedOrganization.name}?`
      );
      if (isConfirmed) {
        await suiteCore.db.organizations.delete(selectedOrganization.id);
        setSelectedOrganization(undefined);
        toast.success('Organization deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting organization:', error);
      toast.error('Failed to delete organization');
    } finally {
      setLoadingDelete(false);
    }
  };

  return (
    <React.Fragment>
      {loading ? (
        <AnimatedLoadingSmall />
      ) : (
        <div className="flex flex-col gap-6 p-6 md:gap-8 md:p-8">
          <div className="flex items-center justify-between gap-2">
            <div className="flex flex-col gap-2">
              <h1 className="text-3xl font-bold tracking-tight">{selectedOrganization?.name}</h1>
              <p className="text-muted-foreground text-sm">{selectedOrganization?.description}</p>
            </div>
            <div style={{ width: 100 }}></div>
            <div className="flex items-center gap-2">
              <Link href="/organizations">
                <Button variant="outline">Switch Organization</Button>
              </Link>
              <Button
                disabled={loadingDelete}
                variant="destructive"
                onClick={handleDeleteOrganization}>
                {loadingDelete ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : null}
                {loadingDelete ? 'Deleting...' : 'Delete Organization'}
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
                <Bot className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalAgents}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.activeAgents} active, {metrics.totalAgents - metrics.activeAgents}{' '}
                  inactive
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Active Workflows</CardTitle>
                <ActivityIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.totalWorkflows}</div>
                <p className="text-xs text-muted-foreground">
                  {metrics.runningWorkflows} running,{' '}
                  {metrics.totalWorkflows - metrics.runningWorkflows} paused
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">Resource Usage</CardTitle>
                <Settings2 className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metrics.resourceUsage}%</div>
                <p className="text-xs text-muted-foreground">Agent utilization</p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">Recent Activity</CardTitle>
                    <CardDescription>Latest actions across your organization</CardDescription>
                  </div>
                  {recentActivity.length > MAX_RECENT_ACTIVITY && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowAllActivity(!showAllActivity)}
                      className="text-muted-foreground hover:text-primary">
                      {showAllActivity ? 'Hide' : 'View all'}
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivity
                    .slice(0, showAllActivity ? recentActivity.length : MAX_RECENT_ACTIVITY)
                    .map(activity => (
                      <div className="flex items-center gap-4">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center ${
                            activity.color
                          }`}>
                          {activity.icon}
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium">{activity.title}</p>
                          <p className="text-xs text-muted-foreground">
                            {moment(activity.timestamp).fromNow()}
                          </p>
                        </div>
                      </div>
                    ))}
                  {recentActivity.length === 0 && (
                    <p className="text-sm text-muted-foreground">No recent activity</p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-xl">Quick Actions</CardTitle>
                    <CardDescription>Common tasks and operations</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <NewAgentButton />
                  <NewWorkflowButton />
                  <Link href="/dashboard/resources">
                    <Button variant="outline" className="w-full justify-start">
                      <Settings2 className="mr-2 h-4 w-4" />
                      Manage Resources
                    </Button>
                  </Link>
                  <Link href="/dashboard/team">
                    <Button variant="outline" className="w-full justify-start">
                      <Users className="mr-2 h-4 w-4" />
                      Invite Team
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </React.Fragment>
  );
}
