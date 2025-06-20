import { suiteCore } from '@/core/suite';
import { create } from 'zustand';

import {
  Admin,
  AggregatedAgent,
  AggregatedOrganization,
  AggregatedWorkflow,
  MessageContent,
  ParsedMessage,
  ParsedUser,
  WorkflowId,
} from '@getgrowly/core';

export const STORAGE_KEY_SELECTED_ORGANIZATION_ID = (userId: string) =>
  `SUITE_SELECTED_ORGANIZATION_ID_${userId}`;

export type StateStatus = 'idle' | 'loading';

export type ConversationStatus = StateStatus | 'sending' | 'agent-thinking';

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

  // Agent Users
  organizationUserStatus: StateStatus;
  organizationUsers: ParsedUser[];
  fetchUsersByOrganizationId: (organizationId: string) => Promise<ParsedUser[]>;
  selectedOrganizationUser: ParsedUser | null;
  setSelectedOrganizationUser: (user: ParsedUser | null) => void;

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
  selectedAgent: AggregatedAgent | null;
  setSelectedAgent: (agent: AggregatedAgent | null) => void;

  // Agent Users
  agentUserStatus: StateStatus;
  agentUsers: ParsedUser[];
  fetchUsersByAgentId: (agentId: string) => Promise<ParsedUser[]>;
  selectedAgentUser: ParsedUser | null;
  setSelectedAgentUser: (user: ParsedUser | null) => void;

  // Messages
  conversationStatus: ConversationStatus;
  setConversationStatus: (status: ConversationStatus) => void;
  currentConversationMessages: ParsedMessage[];
  addConversationMessage: (message: ParsedMessage) => void;
  fetchCurrentConversationMessages: () => Promise<ParsedMessage[]>;
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

  // Organization Users
  organizationUserStatus: 'idle',
  organizationUsers: [],
  fetchUsersByOrganizationId: async (organizationId: string) => {
    set({ organizationUserStatus: 'loading' });
    const users = await suiteCore.users.getUsersByOrganizationId(organizationId);
    set({ organizationUsers: users, organizationUserStatus: 'idle' });
    return users;
  },
  selectedOrganizationUser: null,
  setSelectedOrganizationUser: (user: ParsedUser | null) => set({ selectedOrganizationUser: user }),

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
  selectedAgent: null,
  setSelectedAgent: (agent: AggregatedAgent | null) => set({ selectedAgent: agent }),

  // Organizations
  organizations: [],
  setOrganizations: (organizations: AggregatedOrganization[]) => set({ organizations }),
  fetchOrganizations: async () => {
    set({ organizationStatus: 'loading' });
    const admin = get().admin;
    if (!admin || !admin.id) throw new Error('No admin authenticated');
    const organizations = await suiteCore.organizations.getOrganizationsByAdminId(admin.id);
    set({ organizations, organizationStatus: 'idle' });
    return organizations;
  },
  createOrganization: async (name: string, description: string) => {
    set({ organizationStatus: 'loading' });
    const admin = get().admin;
    if (!admin || !admin.id) throw new Error('No admin authenticated');
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

  // Users
  agentUserStatus: 'idle',
  agentUsers: [],
  fetchUsersByAgentId: async (agentId: string) => {
    set({ agentUserStatus: 'loading' });
    const users = await suiteCore.users.getUsersByAgentId(agentId);
    set({
      agentUsers: users,
      agentUserStatus: 'idle',
    });
    return users;
  },
  selectedAgentUser: null,
  setSelectedAgentUser: (user: ParsedUser | null) => set({ selectedAgentUser: user }),

  // Conversations
  currentConversationMessages: [],
  conversationStatus: 'idle',
  setConversationStatus: (status: ConversationStatus) => set({ conversationStatus: status }),
  addConversationMessage: (message: ParsedMessage) =>
    set(state => ({
      currentConversationMessages: [...state.currentConversationMessages, message],
    })),
  fetchCurrentConversationMessages: async () => {
    try {
      set({ conversationStatus: 'loading' });
      const agent = get().selectedAgent;
      const user = get().selectedAgentUser;
      if (!agent?.id || !user?.id) {
        throw new Error('Agent or user not found');
      }
      const messages = await suiteCore.conversations.getMessagesOfAgentAndUser(agent.id, user.id);
      const parsedMessage: ParsedMessage[] = messages.map(message => {
        const messageContent = JSON.parse(message.content) as MessageContent;
        return {
          ...message,
          ...messageContent,
        };
      });
      set({ currentConversationMessages: parsedMessage, conversationStatus: 'idle' });
      return parsedMessage;
    } catch (error) {
      set({ conversationStatus: 'idle' });
      throw new Error(`Failed to fetch messages: ${error}`);
    }
  },
}));
