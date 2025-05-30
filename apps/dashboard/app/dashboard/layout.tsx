'use client';

import ProtectedAuthProvider from '@/components/providers/protected-auth-provider';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type React from 'react';
import { Suspense, useEffect, useState } from 'react';

import Navbar, { navigations } from './navbar';

const AnimatedLoading = dynamic(
  () =>
    import('@/components/animated-components/animated-loading').then(
      module => module.AnimatedLoading
    ),
  { ssr: false }
);

export const PaddingLayout = ({ children }: { children: React.ReactNode }) => {
  return <div className="max-w-7xl mx-auto p-4 md:p-6">{children}</div>;
};

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
      <Navbar />
      <div className="flex flex-1">
        {/* Main Content */}
        <main className="flex-1 overflow-auto bg-white">
          <Suspense fallback={<AnimatedLoading />}>
            <ProtectedAuthProvider>{children}</ProtectedAuthProvider>
          </Suspense>
        </main>
      </div>

      {/* Bottom Navigation (Mobile) */}
      {isMobile && (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around items-center p-2 z-50">
          {navigations.map(item => {
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
