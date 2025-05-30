'use client';

import '@rainbow-me/rainbowkit/styles.css';
import dynamic from 'next/dynamic';

const AppProvider = dynamic(async () => (await import('@/components/AppProvider')).AppProvider, {
  ssr: false,
});

const Demo = dynamic(async () => await import('@/components/Demo'), {
  ssr: false,
});

export default function Home() {
  return (
    <AppProvider>
      <main className="flex min-h-screen w-full bg-muted/40">
        <Demo />
      </main>
    </AppProvider>
  );
}
