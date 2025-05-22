// AppContext.js
import { type ComponentMode, type ComponentTheme, SuiteComponent } from '@/types/suite';
import { SuiteConfig } from '@getgrowly/suite';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type React from 'react';
import { createContext, useState } from 'react';
import { WagmiProvider } from 'wagmi';
import { base } from 'wagmi/chains';
import { useWagmiConfig } from '../app/wagmi';

type State = {
  activeComponent?: SuiteComponent | undefined;
  setActiveComponent?: (component: SuiteComponent | undefined) => void;
  chainId?: number;
  setChainId?: (chainId: number) => void;
  componentTheme?: ComponentTheme | undefined;
  setComponentTheme?: (theme: ComponentTheme | undefined) => void;
  componentMode: ComponentMode | undefined;
  setComponentMode: (mode: ComponentMode | undefined) => void;
  displayMode: SuiteConfig['display'];
  setDisplayMode: (mode: SuiteConfig['display']) => void;
};

export const defaultState: State = {
  activeComponent: SuiteComponent.DemoChatWidget,
  chainId: base.id,
  componentTheme: 'monoTheme',
  setComponentTheme: () => {},
  componentMode: 'auto',
  setComponentMode: () => {},
  displayMode: 'panel',
  setDisplayMode: () => {},
};

export const AppContext = createContext(defaultState);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const wagmiConfig = useWagmiConfig();
  const queryClient = new QueryClient();

  const [activeComponent, setActiveComponent] = useState<SuiteComponent | undefined>(
    defaultState.activeComponent
  );

  const [componentTheme, setComponentTheme] = useState<ComponentTheme | undefined>(
    defaultState.componentTheme
  );

  const [componentMode, setComponentMode] = useState<ComponentMode | undefined>(
    defaultState.componentMode
  );

  const [chainId, setChainId] = useState<number | undefined>(defaultState.chainId);

  const [displayMode, setDisplayMode] = useState<SuiteConfig['display']>(defaultState.displayMode);

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <AppContext.Provider
            value={{
              activeComponent,
              setActiveComponent,
              chainId,
              setChainId,
              componentTheme,
              setComponentTheme,
              componentMode,
              setComponentMode,
              displayMode,
              setDisplayMode,
            }}>
            {children}
          </AppContext.Provider>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
