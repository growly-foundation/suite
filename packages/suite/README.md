<div align="center">
  <p>
    <a href="https://getgrowly.app">
      <img width="500px" src="https://raw.githubusercontent.com/growly-foundation/assets/refs/heads/main/logo/suite-full.png"/>
    </a>
  </p>
  <p style="font-size: 1.2em; max-width: 600px; margin: 0 auto 20px;">
    Empower DeFi Adoption with AI-powered Engine
  </p>
</div>

Suite is an AI-powered engine designed to streamline DeFi adoption by integrating cutting-edge AI agents into blockchain applications. Our solution bridges the gap between complex DeFi protocols and everyday users through an intuitive AI chat widget that can be easily embedded into any dApp.

Built on Base, Suite leverages the power of AI to help users navigate on-chain actions, understand DeFi opportunities, and make informed decisions without requiring deep technical knowledge of blockchain.

| Resource Name      | Link                          |
| ------------------ | ----------------------------- |
| Website            | https://getgrowly.app         |
| Suite Dashboard    | https://suite.getgrowly.app   |
| Suite Uniswap Demo | https://uniswap.getgrowly.app |

## Getting Started

Run the below command to install Suite widgets to your DApps:

```bash
npm install @getgrowly/suite
```

Integrates the `SuiteProvider` to your React app. This is required for Suite widgets to function.

### React

Required version: `> v15.0.0`

```tsx
import { SuiteProvider, ChatWidget } from '@getgrowly/suite';

// Agent Id and Organization Id can be retrieved on `suite.getgrowly.app` (Agents > Integration Guide).
export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SuiteProvider
      context={{
        agentId: `AGENT_ID`,
        organizationApiKey: `ORGANIZAITON_ID`,
        config: {
          display: 'fullView',
        },
      }}>
      {children}
      <ChatWidget />
    </SuiteProvider>
  );
};
```

### Nextjs

Required version: `> v14.0.0`

```tsx
'use client';

import dynamic from 'next/dynamic';

// Nextjs requires dynamic loading for the Growly Suite components as it uses browser APIs.
const SuiteProvider = dynamic(() => import('@getgrowly/suite'), {
  ssr: false,
});
const ChatWidget = dynamic(() => import('@getgrowly/suite').then(suite => suite.ChatWidget), {
  ssr: false,
});

// Agent Id and Organization Id can be retrieved on `suite.getgrowly.app` (Agents > Integration Guide).
export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SuiteProvider
      context={{
        agentId: `AGENT_ID`,
        organizationApiKey: `ORGANIZAITON_ID`,
        config: {
          display: 'fullView',
        },
      }}>
      {children}
      <ChatWidget />
    </SuiteProvider>
  );
};
```

## Using Agentic Widgets

### ChatWidget

- Requires `SuiteProvider`

Most common component that creates the widget which pops up panel on clicked, allows developers to communicate with the agent back and forth.

```tsx
import { ChatWidget } from '@getgrowly/suite';

<ChatWidget />;
```

To update the display mode (`fullView` | `panel`) of the `ChatWidget`, you can simply overwrite the `config.display` parameter in the `SuiteProvider` context. By default, the widget is set to `fullView`.

### GrowlyButton

- Requires `SuiteProvider`

The `GrowlyButton` component is similar to a normal button component but sending a message to the `<ChatWidget/>` and trigger the designated agent to respond from the prompt.

```tsx
<GrowlyButton triggerMessage={'Analyze my portfolio on Uniswap'} onClick={handleSend}>
  Swap
</GrowlyButton>
```

## Hooks

- `useSuite`: Access the configurations provided on `SuiteProvider` initialization.
- `useSuiteSession`: Access to the current session data of the widget. For example, current user, agent, workflows...
- `useChatActions`: Set of methods to communicate with the agent.

## Manual Triggers

The library provides the integrators powerful methods to trigger the agent manually:

```tsx
const {
  // Send a messageo on behalf of the agent.
  textAgentMessage,
  // Send a message on behalf of the user.
  sendUserMessage,
  // Send a message on behalf of the user and generate the agent response.
  generateAgentMessage,
} = useChatActions();
```
