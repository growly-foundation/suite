'use client';

import { NavMain } from '@/components/navigations/nav-main';
import { NavUser } from '@/components/navigations/nav-user';
import { OrganizationSwitcher } from '@/components/organizations/organization-switcher';
import { IconContainer } from '@/components/ui/icon-container';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';
import { cn } from '@/lib/utils';
import { BotIcon, FileStackIcon, HomeIcon, UserIcon, WorkflowIcon } from 'lucide-react';
import { usePathname } from 'next/navigation';
import * as React from 'react';

const NavigationIcon = ({ icon, selected }: { icon: React.ReactNode; selected: boolean }) => {
  return (
    <IconContainer
      className={cn('text-muted-foreground', selected && 'bg-blue-500 border-blue-500 text-white')}>
      {icon}
    </IconContainer>
  );
};

export const navigations = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: (selected: boolean) => (
      <NavigationIcon icon={<HomeIcon className="h-3 w-3" />} selected={selected} />
    ),
  },
  {
    title: 'Agents',
    url: '/dashboard/agents',
    icon: (selected: boolean) => (
      <NavigationIcon icon={<BotIcon className="h-3 w-3" />} selected={selected} />
    ),
  },
  {
    title: 'Users',
    url: '/dashboard/users',
    icon: (selected: boolean) => (
      <NavigationIcon icon={<UserIcon className="h-3 w-3" />} selected={selected} />
    ),
  },
  {
    title: 'Workflows',
    url: '/dashboard/workflows',
    icon: (selected: boolean) => (
      <NavigationIcon icon={<WorkflowIcon className="h-3 w-3" />} selected={selected} />
    ),
  },
  {
    title: 'Resources',
    url: '/dashboard/resources',
    icon: (selected: boolean) => (
      <NavigationIcon icon={<FileStackIcon className="h-3 w-3" />} selected={selected} />
    ),
  },
];
export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();
  return (
    <Sidebar variant="inset" collapsible="none" className="h-screen border-r pt-2" {...props}>
      <SidebarHeader>
        <OrganizationSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain
          items={navigations.map((item, index) => {
            const isActive = index === 0 ? pathname === item.url : pathname.includes(`${item.url}`);
            return {
              ...item,
              icon: item.icon(isActive),
              isActive,
            };
          })}
        />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
