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
import '@getgrowly/suite/dist/styles.css';

// Agent Id and Organization Id can be retrieved on `suite.getgrowly.app` (Agents > Integration Guide).
export const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SuiteProvider
      context={{
        agentId: `AGENT_ID`,
        organizationApiKey: `ORGANIZATION_ID`,
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
        organizationApiKey: `ORGANIZATION_ID`,
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

## Theme System

The suite includes a comprehensive theme system that provides consistent styling across all components. The system is built on a design token approach, making it easy to customize and extend.

### Theme Structure

Each theme is composed of tokens organized into semantic categories:

```typescript
interface ThemeTokens {
  // Brand colors
  brand: {
    primary: string;
    secondary: string;
    accent: string;
  };

  // Background colors
  background: {
    default: string;
    paper: string;
    subtle: string;
    inverse: string;
  };

  // Text colors
  text: {
    primary: string;
    secondary: string;
    muted: string;
    inverse: string;
  };

  // UI element styles
  ui: {
    header: { background: string; text: string };
    border: { default: string; subtle: string };
    hover: { default: string };
  };

  // Typography settings
  typography: {
    fontFamily: string;
    fontWeight: {
      normal: string;
      medium: string;
      semibold: string;
      bold: string;
    };
  };

  // Spacing scale
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };

  // Border radius
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };

  // Shadow values
  shadow: {
    sm: string;
    md: string;
    lg: string;
  };
}
```

### Built-in Themes

The suite includes two built-in themes:

- `lightTheme`: A clean, light theme optimized for day use
- `darkTheme`: A dark theme designed for reduced eye strain in low-light environments

### Using Themes

#### 1. Setting a Theme

You can specify a theme when initializing the `SuiteProvider`:

```tsx
import { SuiteProvider, darkTheme } from '@getgrowly/suite';

// In your app
<SuiteProvider
  organizationApiKey="your-api-key"
  config={{
    theme: darkTheme, // Use the built-in dark theme
    // other config options...
  }}>
  {children}
</SuiteProvider>;
```

Alternatively, you can use `brandName` to apply a primary color to the theme:

```tsx
<SuiteProvider
  organizationApiKey="your-api-key"
  config={{
    brandName: 'Your App Name', // Generates a theme with your brand color
    // other config options...
  }}>
  {children}
</SuiteProvider>
```

#### 2. Creating Custom Themes

Create a custom theme by extending the default themes:

```tsx
import { lightTheme } from '@getgrowly/suite';

const customTheme = {
  ...lightTheme,
  brand: {
    ...lightTheme.brand,
    primary: '#ff0000', // Your custom primary color
    accent: '#00ff00', // Your custom accent color
  },
  // Override other theme values as needed
};

// Then use it in your SuiteProvider
<SuiteProvider
  config={{
    theme: customTheme,
    // other config options...
  }}>
  {children}
</SuiteProvider>;
```

#### 3. Using Theme in Components

Access the current theme using the `useTheme` hook:

```tsx
import { useTheme } from '@/components/providers/ThemeProvider';

function MyComponent() {
  const { theme } = useTheme();

  return (
    <div style={{ color: theme.text.primary, backgroundColor: theme.background.default }}>
      Themed content
    </div>
  );
}
```

Use the `useThemeStyles` hook for consistent component styling:

```tsx
import { useThemeStyles } from '@/hooks/use-theme-styles';

function MyComponent() {
  const styles = useThemeStyles();

  return (
    <div style={styles.panel.container}>
      <header style={styles.panel.header}>Header</header>
      <div style={styles.content}>Content</div>
    </div>
  );
}
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
