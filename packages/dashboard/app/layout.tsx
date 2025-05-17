import type React from 'react';
import './globals.css';
import { coinbaseFont } from './fonts';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { cn } from '@/lib/utils';
import { Providers } from '@/components/providers/providers';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Growly Suite Dashboard',
  description: 'Manage your AI agents for Growly Suite and workflows with ease.',
  keywords: 'Growly, DeFi, AI, LLM, MCP, knowledge base, AI agents, MCP server',
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        rel: 'manifest',
        url: '/site.webmanifest',
      },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://suite.getgrowly.app',
    title: 'Growly Suite Dashboard',
    description: 'Manage your AI agents for Growly Suite and workflows with ease.',
    siteName: 'Growly Suite Dashboard',
    images: [
      {
        url: 'https://getgrowly.app/banners/dashboard-banner.png',
        width: 1200,
        height: 630,
        alt: 'Growly Suite Dashboard',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title:
      'Growly Suite Dashboard | Manage your AI agents for Growly Suite and workflows with ease.',
    description: 'Manage your AI agents for Growly Suite and workflows with ease.',
    images: ['https://getgrowly.app/banners/dashboard-banner.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: 'v0.dev',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          'min-h-screen bg-background antialiased',
          coinbaseFont.variable,
          geistSans.variable,
          geistMono.variable
        )}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
