// Using default import
import { cn } from '@/lib/utils';
import { GeistMono } from 'geist/font/mono';
import { GeistSans } from 'geist/font/sans';
import type { Metadata } from 'next';
import Script from 'next/script';
import type React from 'react';

import '@getgrowly/suite/styles.css';
import '@getgrowly/ui/styles.css';

import { coinbaseFont } from './fonts';
// Load UI styles
import './globals.css';
import { AppInner } from './inner';

export const metadata: Metadata = {
  title: 'Suite | Create Growth That Lasts.',
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
    title: 'Suite | Create Growth That Lasts.',
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
    title: 'Suite | Create Growth That Lasts.',
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
      <head>
        {/* Google Analytics Measurement ID */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-EK55XN1XT5"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-EK55XN1XT5');
          `}
        </Script>
      </head>
      <body
        className={cn(
          'min-h-screen bg-background antialiased',
          coinbaseFont.variable,
          GeistSans.variable,
          GeistMono.variable
        )}
        style={{
          scrollBehavior: 'smooth',
        }}>
        <AppInner>{children}</AppInner>
      </body>
    </html>
  );
}
