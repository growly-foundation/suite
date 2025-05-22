import { useContext, useEffect } from 'react';
import { base } from 'viem/chains';
import { AppContext } from '../AppProvider';
import { GrowlyComponent, Theme } from '@getgrowly/suite';
import { useSuite, SuiteProvider } from '@getgrowly/suite';
import { useAccount } from 'wagmi';
import { DUMMY_AGENT_ID, DUMMY_ORGANIZATION_API_KEY } from '@/lib/constants';
import { Button } from '../ui/button';

function ChatWidgetComponent({ children }: { children: React.ReactNode }) {
  const {
    config,
    appState: { setConfig },
  } = useSuite();
  const { componentTheme, chainId, displayMode } = useContext(AppContext);
  useEffect(() => {
    if (!setConfig) {
      return;
    }
    setConfig({
      ...config,
      theme: componentTheme ? Theme[componentTheme] : Theme.monoTheme,
      display: displayMode,
    });
  }, [componentTheme, setConfig, displayMode]);
  return (
    <div className="relative mb-[50%] flex h-full w-full flex-col items-center">
      {chainId !== base.id ? (
        <div className="absolute top-0 left-0 z-10 flex h-full w-full flex-col justify-center rounded-xl bg-[#000000] bg-opacity-50 text-center">
          <div className="mx-auto w-2/3 rounded-md bg-muted p-6 text-sm">
            Buy Demo is only available on Base.
            <br />
            You're connected to a different network. Switch to Base to continue using the app.
          </div>
        </div>
      ) : (
        children
      )}
    </div>
  );
}
export function ChatWidgetDemoLayout({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  return (
    <SuiteProvider
      context={{
        agentId: DUMMY_AGENT_ID,
        organizationApiKey: DUMMY_ORGANIZATION_API_KEY,
        session: {
          walletAddress: address,
        },
        integration: {
          onchainKit: {
            chain: base,
            projectId: process.env.NEXT_PUBLIC_SUITE_ONCHAINKIT_PROJECT_ID,
            apiKey: process.env.NEXT_PUBLIC_SUITE_ONCHAINKIT_CLIENT_KEY,
            enabled: true,
            config: {
              appearance: {
                theme: 'base',
                mode: 'light',
              },
            },
          },
        },
        config: {
          theme: Theme.monoTheme,
          display: 'fullView',
        },
      }}>
      <ChatWidgetComponent>
        <GrowlyComponent.Step id="step1" workflow="workflow1">
          <Button>On Click Triggers Event</Button>
        </GrowlyComponent.Step>
        {children}
      </ChatWidgetComponent>
    </SuiteProvider>
  );
}
