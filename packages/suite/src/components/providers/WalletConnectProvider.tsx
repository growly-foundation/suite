import { useWagmiConfig } from '@/hooks/use-wagmi';
import { RainbowKitProvider } from '@rainbow-me/rainbowkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useContext, useEffect } from 'react';
import { WagmiProvider, useAccount } from 'wagmi';

import { SuiteContext } from './SuiteProvider';

export const WalletConnectProvider = ({ children }: { children: React.ReactNode }) => {
  const wagmiConfig = useWagmiConfig();
  const queryClient = new QueryClient();
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          <WalletConnectConsumer>{children}</WalletConnectConsumer>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};

const WalletConnectConsumer = ({ children }: { children: React.ReactNode }) => {
  const { appState } = useContext(SuiteContext);
  const { setWalletAddress } = appState;
  const { address } = useAccount();

  useEffect(() => {
    setWalletAddress(address);
  }, [address]);

  return <>{children}</>;
};
