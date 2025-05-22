'use client';

import type React from 'react';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home } from 'lucide-react';
import { UserButton } from '@/components/auth/user-button';
import { OrganizationSwitcher } from '@/components/organizations/organization-switcher';
import dynamic from 'next/dynamic';
import ProtectedAuthProvider from '@/components/providers/protected-auth-provider';
import Image from 'next/image';

const AnimatedLoading = dynamic(
  () =>
    import('@/components/animated-components/animated-loading').then(
      module => module.AnimatedLoading
    ),
  { ssr: false }
);

// Mock icons for navigation
const IconHome = Home;
const IconWaveSine = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M2 12h2a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2" />
    <path d="M2 4h4a2 2 0 0 1 2 2v4a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2V6a2 2 0 0 1 2-2h2" />
  </svg>
);
const IconAi = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M12 2v8" />
    <path d="m4.93 10.93 1.41 1.41" />
    <path d="M2 18h2" />
    <path d="M20 18h2" />
    <path d="m19.07 10.93-1.41 1.41" />
    <path d="M22 22H2" />
    <path d="m16 6-4 4-4-4" />
    <path d="M16 18a4 4 0 0 0-8 0" />
  </svg>
);
const IconSlideshow = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round">
    <path d="M8 2h8" />
    <path d="M9 2v2.5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 .5-.5V2" />
    <rect width="18" height="14" x="3" y="8" rx="2" />
    <path d="M12 19v3" />
    <path d="M9 22h6" />
  </svg>
);

const navigation = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: IconHome,
  },
  {
    title: 'Agents',
    url: '/dashboard/agents',
    icon: IconAi,
  },
  {
    title: 'Workflows',
    url: '/dashboard/workflows',
    icon: IconWaveSine,
  },
  {
    title: 'Resources',
    url: '/dashboard/resources',
    icon: IconSlideshow,
  },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkIfMobile();
    window.addEventListener('resize', checkIfMobile);

    return () => {
      window.removeEventListener('resize', checkIfMobile);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Header */}
      <header className="sticky top-0 z-50 border-b shadow-md p-4 md:px-6 bg-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="font-bold text-lg flex items-center">
              <Image src="/logos/suite-icon.png" alt="Logo" width={35} height={35} />
            </Link>
            <OrganizationSwitcher />
            <div className="flex gap-3">
              {navigation.map((item, index) => {
                const isActive =
                  index === 0 ? pathname === item.url : pathname.includes(`${item.url}`);
                return (
                  <Link
                    key={item.url}
                    href={item.url}
                    className={cn('growly-nav-item', isActive && 'active')}>
                    <item.icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                );
              })}
            </div>
          </div>
          <UserButton />
        </div>
      </header>
      <div className="flex flex-1">
        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 overflow-auto bg-white">
          <div className="max-w-7xl mx-auto">
            <Suspense fallback={<AnimatedLoading />}>
              <ProtectedAuthProvider>{children}</ProtectedAuthProvider>
            </Suspense>
          </div>
        </main>
      </div>

      {/* Bottom Navigation (Mobile) */}
      {isMobile && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center p-2 z-50">
          {navigation.map(item => {
            const isActive = pathname === item.url || pathname.includes(`${item.url}`);
            return (
              <Link
                key={item.url}
                href={item.url}
                className={cn('growly-mobile-nav-item', isActive && 'active')}>
                <item.icon className="h-6 w-6" />
                <span>{item.title}</span>
              </Link>
            );
          })}
        </nav>
      )}
    </div>
  );
}
