import { UserButton } from '@/components/auth/user-button';
import { OrganizationSwitcher } from '@/components/organizations/organization-switcher';
import { cn } from '@/lib/utils';
import { BotIcon, FileStackIcon, HomeIcon, WorkflowIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const navigations = [
  {
    title: 'Dashboard',
    url: '/dashboard',
    icon: HomeIcon,
  },
  {
    title: 'Agents',
    url: '/dashboard/agents',
    icon: BotIcon,
  },
  {
    title: 'Workflows',
    url: '/dashboard/workflows',
    icon: WorkflowIcon,
  },
  {
    title: 'Resources',
    url: '/dashboard/resources',
    icon: FileStackIcon,
  },
];

export default function Navbar() {
  const pathname = usePathname();
  return (
    <header className="sticky top-0 z-50 border-b p-4 md:px-6 bg-white">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="font-bold text-lg flex items-center">
            <Image src="/logos/suite-icon.png" alt="Logo" width={35} height={35} />
          </Link>
          <OrganizationSwitcher />
          <div className="flex gap-3">
            {navigations.map((item, index) => {
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
  );
}
