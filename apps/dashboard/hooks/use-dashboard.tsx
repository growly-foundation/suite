import { suiteCore } from '@/core/suite';
import { create } from 'zustand';

import {
  AggregatedAgent,
  AggregatedOrganization,
  AggregatedWorkflow,
  WorkflowId,
} from '@getgrowly/core';
import { Admin } from '@getgrowly/core';

export const STORAGE_KEY_SELECTED_ORGANIZATION_ID = (userId: string) =>
  `SUITE_SELECTED_ORGANIZATION_ID_${userId}`;

export type StateStatus = 'idle' | 'loading';

/**
 * State storage for managing application state.
 */
export type DashboardAppState = {
  // Authentication
  authStatus: StateStatus;
  admin: Admin | null;
  setAdmin: (user: Admin | null) => void;

  // Selected Organization
  selectedOrganization: AggregatedOrganization | null;
  setSelectedOrganization: (organization: AggregatedOrganization | undefined) => void;

  // Organizations
  organizationStatus: StateStatus;
  fetchOrganizations: () => Promise<AggregatedOrganization[]>;
  organizations: AggregatedOrganization[];
  setOrganizations: (organizations: AggregatedOrganization[]) => void;
  createOrganization: (name: string, description: string) => Promise<AggregatedOrganization>;

  // Workflows
  workflowStatus: StateStatus;
  organizationWorkflows: AggregatedWorkflow[];
  getOrganizationWorkflows: (workflowId: WorkflowId) => AggregatedWorkflow | undefined;
  setOrganizationWorkflows: (workflows: AggregatedWorkflow[]) => void;
  fetchOrganizationWorkflows: () => Promise<AggregatedWorkflow[]>;
  fetchOrganizationWorkflowById: (workflowId: WorkflowId) => Promise<AggregatedWorkflow | null>;

  // Agents
  agentStatus: StateStatus;
  organizationAgents: AggregatedAgent[];
  fetchOrganizationAgents: () => Promise<AggregatedAgent[]>;
  fetchOrganizationAgentById: (agentId: string) => Promise<AggregatedAgent | null>;
};

/**
 * Hook for managing application state.
 */
export const useDashboardState = create<DashboardAppState>((set, get) => ({
  // Authentication
  authStatus: 'idle',
  admin: null,
  setAdmin: (admin: Admin | null) => set({ admin }),

  // Selected Organization
  organizationStatus: 'idle',
  selectedOrganization: null,
  setSelectedOrganization: (organization: AggregatedOrganization | undefined) => {
    const admin = get().admin;
    if (!admin?.id) throw new Error('No admin authenticated');
    if (organization) {
      localStorage.setItem(STORAGE_KEY_SELECTED_ORGANIZATION_ID(admin.id), organization.id);
    } else {
      localStorage.removeItem(STORAGE_KEY_SELECTED_ORGANIZATION_ID(admin.id));
    }
    set({ selectedOrganization: organization });
  },

  // Agents
  agentStatus: 'idle',
  organizationAgents: [],
  fetchOrganizationAgents: async () => {
    set({ agentStatus: 'loading' });
    const selectedOrganization = get().selectedOrganization;
    if (!selectedOrganization) throw new Error('No organization selected');

    const agents = await suiteCore.agents.getAggregatedAgentsByOrganizationId(
      selectedOrganization.id
    );
    set({
      organizationAgents: agents,
      agentStatus: 'idle',
    });
    return agents;
  },
  fetchOrganizationAgentById: async (agentId: string) => {
    set({ agentStatus: 'loading' });
    const selectedOrganization = get().selectedOrganization;
    if (!selectedOrganization) throw new Error('No organization selected');

    const agent = await suiteCore.agents.getAggregatedAgent(agentId);
    if (!agent) throw new Error('Agent not found');
    set(state => ({
      organizationAgents: state.organizationAgents.map(a => (a.id === agentId ? agent : a)),
      agentStatus: 'idle',
    }));
    return agent;
  },

  // Organizations
  organizations: [],
  setOrganizations: (organizations: AggregatedOrganization[]) => set({ organizations }),
  fetchOrganizations: async () => {
    set({ organizationStatus: 'loading' });
    const admin = get().admin;
    if (!admin) throw new Error('No admin authenticated');
    const organizations = await suiteCore.organizations.getOrganizationsByAdminId(admin.id);
    set({ organizations, organizationStatus: 'idle' });
    return organizations;
  },
  createOrganization: async (name: string, description: string) => {
    set({ organizationStatus: 'loading' });
    const admin = get().admin;
    if (!admin) throw new Error('No admin authenticated');
    const organization = await suiteCore.organizations.createOrganization(
      name,
      description,
      admin.id
    );
    set({ organizations: [...get().organizations, organization], organizationStatus: 'idle' });
    return organization;
  },

  // Workflows
  workflowStatus: 'idle',
  organizationWorkflows: [],
  getOrganizationWorkflows: (workflowId: string) =>
    get().organizationWorkflows.find(workflow => workflow.id === workflowId),
  setOrganizationWorkflows: (workflows: AggregatedWorkflow[]) =>
    set({ organizationWorkflows: workflows }),
  fetchOrganizationWorkflows: async () => {
    set({ workflowStatus: 'loading' });
    const selectedOrganization = get().selectedOrganization;
    if (!selectedOrganization) throw new Error('No organization selected');

    const aggregatedWorkflows: AggregatedWorkflow[] =
      await suiteCore.workflows.getWorkflowsByOrganizationId(selectedOrganization.id);
    set({ organizationWorkflows: aggregatedWorkflows, workflowStatus: 'idle' });
    return aggregatedWorkflows;
  },

  // Steps
  fetchOrganizationWorkflowById: async (workflowId: string) => {
    set({ workflowStatus: 'loading' });
    const selectedOrganization = get().selectedOrganization;
    if (!selectedOrganization) throw new Error('No organization selected');

    const workflow = await suiteCore.workflows.getWorkflowWithSteps(workflowId);
    if (!workflow) throw new Error('Workflow not found');
    set(state => ({
      organizationWorkflows: state.organizationWorkflows.map(w =>
        w.id === workflowId ? workflow : w
      ),
      workflowStatus: 'idle',
    }));
    return workflow;
  },
}));
