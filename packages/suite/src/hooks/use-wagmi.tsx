'use client';

import { useSuite } from '@/hooks/use-suite';
import { connectorsForWallets } from '@rainbow-me/rainbowkit';
import {
  coin98Wallet,
  coinbaseWallet,
  metaMaskWallet,
  rabbyWallet,
  rainbowWallet,
  walletConnectWallet,
} from '@rainbow-me/rainbowkit/wallets';
import { useMemo } from 'react';
import { createConfig, http } from 'wagmi';
import { base, baseSepolia, mainnet, sepolia } from 'wagmi/chains';

export const useWagmiConfig = () => {
  const { session } = useSuite();
  const projectId = session?.walletConnect?.projectId ?? '';
  if (!projectId) {
    const providerErrMessage =
      'To connect to all Wallets you need to provide a NEXT_PUBLIC_WC_PROJECT_ID env variable';
    throw new Error(providerErrMessage);
  }

  return useMemo(() => {
    const connectors = connectorsForWallets(
      [
        {
          groupName: 'Recommended Wallet',
          wallets: [coinbaseWallet],
        },
        {
          groupName: 'Other Wallets',
          wallets: [rainbowWallet, metaMaskWallet, coin98Wallet, rabbyWallet, walletConnectWallet],
        },
      ],
      {
        appName: 'onchainkit',
        projectId,
      }
    );

    const wagmiConfig = createConfig({
      chains: [base, baseSepolia, mainnet, sepolia],
      // turn off injected provider discovery
      multiInjectedProviderDiscovery: false,
      connectors,
      ssr: true,
      transports: {
        [mainnet.id]: http(),
        [sepolia.id]: http(),
        [base.id]: http(),
        [baseSepolia.id]: http(),
      },
    });

    return wagmiConfig as any;
  }, [projectId]);
};
