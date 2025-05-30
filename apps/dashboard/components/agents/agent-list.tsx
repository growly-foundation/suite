'use client';

import { Agent } from '@getgrowly/core';

import { AgentCard } from './agent-card';

export function AgentsList({ agents }: { agents: Agent[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-3">
      {agents.length > 0 ? (
        agents.map(agent => {
          return <AgentCard key={agent.id} agent={agent} />;
        })
      ) : (
        <p>No agents found</p>
      )}
    </div>
  );
}
