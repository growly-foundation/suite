'use client';

import { usePrivy } from '@privy-io/react-auth';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Growly Foundation - Growly Customer Support
export const DUMMY_AGENT_ID = 'cbbbc3d2-73fb-4e53-b35d-3c8a1d59adab';
export const DUMMY_ORGANIZATION_API_KEY = '83f5dd65-da1e-4fcf-bc0f-4032778d03fb';

const SuiteProvider = dynamic(() => import('@getgrowly/suite').then(suite => suite.SuiteProvider), {
  ssr: false,
});

const ChatWidget = dynamic(() => import('@getgrowly/suite').then(suite => suite.ChatWidget), {
  ssr: false,
});

export const SuiteProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  const { login, user } = usePrivy();

  return (
    <SuiteProvider
      context={{
        agentId: DUMMY_AGENT_ID,
        organizationApiKey: DUMMY_ORGANIZATION_API_KEY,
        config: {
          display: 'fullView',
        },
        session: {
          walletAddress: user?.wallet?.address as any,
          connect() {
            return login();
          },
        },
      }}>
      <Suspense fallback={null}>
        {children}
        <ChatWidget />
      </Suspense>
    </SuiteProvider>
  );
};
