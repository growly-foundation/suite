'use client';

import ProtectedAuthProvider from '@/components/providers/protected-auth-provider';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { useBreadcrumbLoad } from '@/hooks/use-breadcrumb';
import { cn } from '@/lib/utils';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { Suspense } from 'react';

import { SuiteLogo } from '@getgrowly/ui';

import { AppSidebar } from './siderbar';

const AnimatedLoading = dynamic(
  () =>
    import('@/components/animated-components/animated-loading').then(
      module => module.AnimatedLoading
    ),
  { ssr: false }
);

export const PaddingLayout = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <div className={cn('max-w-7xl mx-auto p-4 md:p-6', className)}>{children}</div>;
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { breadcrumbs } = useBreadcrumbLoad();
  const router = useRouter();
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset className="max-h-screen overflow-hidden">
        <header className="flex h-16 shrink-0 items-center gap-2 border-b">
          <div className="flex items-center gap-2 px-4">
            <Link href="/dashboard" className="font-bold text-lg flex items-center">
              <SuiteLogo width={35} height={35} />
            </Link>
            <Separator orientation="vertical" className="mr-2 data-[orientation=vertical]:h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((breadcrumb, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem
                      key={index}
                      className={cn(index === breadcrumbs.length - 1 && 'font-bold')}
                      onClick={() => {
                        router.push(breadcrumb.href);
                      }}>
                      {breadcrumb.title}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && index > 0 && <BreadcrumbSeparator />}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="h-full overflow-auto">
          <Suspense fallback={<AnimatedLoading />}>
            <ProtectedAuthProvider>{children}</ProtectedAuthProvider>
          </Suspense>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
