'use client';

import { ThemeProvider } from '@/components/theme-provider';

import { SuiteProviderWrapper } from './providers';

export const AppInner = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <SuiteProviderWrapper>{children}</SuiteProviderWrapper>
    </ThemeProvider>
  );
};
