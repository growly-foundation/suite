# @getgrowly/agents

A modular agent system with multi-agent support for Growly applications, built on LangGraph.

## Features

- 🛠️ **Modular Tool System** - Easily register and manage tools
- 🤖 **Multi-Agent Support** - Create complex agent workflows
- 🧩 **Extensible Architecture** - Add custom tools and agents
- 🔄 **Event-Driven** - Listen to agent events in real-time
- 🚀 **Production Ready** - Built with TypeScript and battle-tested patterns

## Installation

```bash
npm install @getgrowly/agents
# or
yarn add @getgrowly/agents
```

## Quick Start

### Basic Usage

```typescript
import { ToolRegistry, ReactAgent } from '@getgrowly/agents';
import { ChatOpenAI } from '@langchain/openai';

// Initialize tool registry
const toolRegistry = new ToolRegistry();

// Set up the language model
toolRegistry.setModel(new ChatOpenAI({ 
  modelName: 'gpt-4',
  temperature: 0 
}));

// Create an agent
const agent = new ReactAgent({
  agentId: 'my-agent',
  systemPrompt: 'You are a helpful assistant',
  verbose: true,
}, toolRegistry);

// Execute the agent
const result = await agent.execute('Hello, world!');
console.log(result.output);
```

### Multi-Agent System

```typescript
import { MultiAgentSystem, ReactAgent } from '@getgrowly/agents';

// Create agents
const researcher = new ReactAgent({
  agentId: 'researcher',
  systemPrompt: 'You are a research assistant',
}, toolRegistry);

const writer = new ReactAgent({
  agentId: 'writer',
  systemPrompt: 'You are a technical writer',
}, toolRegistry);

// Create multi-agent system
const multiAgent = new MultiAgentSystem(
  {
    agents: {
      researcher: { role: 'Research Assistant', goal: 'Gather information' },
      writer: { role: 'Technical Writer', goal: 'Write clear documentation' },
    },
    workflow: {
      type: 'sequential',
      steps: ['researcher', 'writer'],
    },
  },
  toolRegistry
);

// Execute the workflow
const result = await multiAgent.execute('Research and write about AI agents');
```

## Documentation

### Core Concepts

#### Agents

Agents are the core building blocks that process input and generate responses. The package provides a `BaseAgent` class that can be extended to create custom agents.

#### Tools

Tools are functions that agents can use to perform specific tasks. They can be registered with the `ToolRegistry` and made available to agents.

#### Multi-Agent Systems

Create complex workflows by connecting multiple agents together. The system supports different workflow types:

- **Sequential**: Linear flow from one agent to another
- **Hierarchical**: Controller agent delegates to specialist agents
- **Collaborative**: Fully connected agents that can communicate with each other

## API Reference

See the [API documentation](./docs/API.md) for detailed information about all classes and methods.

## Contributing

Contributions are welcome! Please read our [contributing guidelines](./CONTRIBUTING.md) before submitting pull requests.

## License

MIT
