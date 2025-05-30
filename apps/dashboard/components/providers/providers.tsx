'use client';

import { PrivyProvider } from '@privy-io/react-auth';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { ToastContainer } from 'react-toastify';
import { ReactFlowProvider } from 'reactflow';

import '@getgrowly/suite/styles.css';

import { ThemeProvider } from '../theme-provider';
import { SuiteProviderWrapper } from './suite-provider';

const ChatWidget = dynamic(() => import('@getgrowly/suite').then(suite => suite.ChatWidget), {
  ssr: false,
});

const AnimatedLoading = dynamic(
  () =>
    import('@/components/animated-components/animated-loading').then(
      module => module.AnimatedLoading
    ),
  { ssr: false }
);

export const Providers = ({ children }: { children: React.ReactNode }) => {
  let baseComponent = (
    <SuiteProviderWrapper>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
        <ReactFlowProvider>
          <Suspense fallback={<AnimatedLoading />}>
            {children}
            <ChatWidget />
            <ToastContainer />
          </Suspense>
        </ReactFlowProvider>
      </ThemeProvider>
    </SuiteProviderWrapper>
  );
  // If environment variables for Privy credentials are not set,
  // do not wrap the component with PrivyProvider.
  if (process.env.NEXT_PUBLIC_PRIVY_APP_ID && process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID) {
    baseComponent = (
      <PrivyProvider
        appId={process.env.NEXT_PUBLIC_PRIVY_APP_ID}
        clientId={process.env.NEXT_PUBLIC_PRIVY_CLIENT_ID}
        config={{
          loginMethods: ['email'],
          embeddedWallets: {
            createOnLogin: 'users-without-wallets',
          },
        }}>
        {baseComponent}
      </PrivyProvider>
    );
  }
  return baseComponent;
};
