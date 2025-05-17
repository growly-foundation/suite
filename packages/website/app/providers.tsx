'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// Growly Foundation - Growly Customer Support
export const DUMMY_AGENT_ID = 'cbbbc3d2-73fb-4e53-b35d-3c8a1d59adab';
export const DUMMY_ORGANIZATION_API_KEY = '83f5dd65-da1e-4fcf-bc0f-4032778d03fb';

const SuiteProvider = dynamic(() => import('@growly/suite').then(suite => suite.SuiteProvider), {
  ssr: false,
});

const ChatWidget = dynamic(() => import('@growly/suite').then(suite => suite.ChatWidget), {
  ssr: false,
});

export const SuiteProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <SuiteProvider
      context={{
        agentId: DUMMY_AGENT_ID,
        organizationApiKey: DUMMY_ORGANIZATION_API_KEY,
        config: {
          display: 'fullView',
        },
        session: {
          walletConnect: {
            projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? '',
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
