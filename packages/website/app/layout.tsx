import type React from 'react';
import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import { coinbaseFont } from './fonts'; // Using default import
import { cn } from '@/lib/utils';
import { AppInner } from './inner';

// Load UI styles
import './globals.css';
import '@getgrowly/ui/styles.css';
import '@getgrowly/suite/styles.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Growly Suite | Empower DeFi Adoption with AI-powered Engine',
  description:
    'Enterprise-grade AI platform with LLM conversations, customizable agents, secure knowledge base, and MCP server support for businesses and government agencies.',
  keywords:
    'enterprise AI, secure AI, government AI solutions, LLM, knowledge base, AI agents, MCP server',
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
    url: 'https://getgrowly.app',
    title: 'Growly Suite | Empower DeFi Adoption with AI-powered Engine',
    description:
      'Enterprise-grade AI platform with advanced security, customization, and control for businesses and government agencies.',
    siteName: 'Growly Suite',
    images: [
      {
        url: 'https://getgrowly.app/banners/suite-preview-banner.png',
        width: 1200,
        height: 630,
        alt: 'Growly Suite',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Growly Suite | Empower DeFi Adoption with AI-powered Engine',
    description: 'Enterprise-grade AI platform with advanced security, customization, and control.',
    images: ['https://getgrowly.app/banners/suite-preview-banner.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
  generator: 'v0.dev',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          'min-h-screen bg-background antialiased',
          coinbaseFont.variable,
          geistSans.variable,
          geistMono.variable
        )}>
        <AppInner>{children}</AppInner>
      </body>
    </html>
  );
}
