import { cn } from '@/lib/utils';
import {
  BarChart3,
  Clock,
  CreditCard,
  FileText,
  HelpCircle,
  LayoutDashboard,
  LineChart,
  Settings,
  Users,
  Wallet,
} from 'lucide-react';
import Link from 'next/link';

interface NavProps {
  isVertical?: boolean;
  className?: string;
}

export function DashboardNav({ isVertical = false, className }: NavProps) {
  const items = [
    {
      title: 'Dashboard',
      href: '/dashboard',
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: 'Assets',
      href: '/dashboard/assets',
      icon: Wallet,
    },
    {
      title: 'Trading',
      href: '/dashboard/trading',
      icon: LineChart,
    },
    {
      title: 'History',
      href: '/dashboard/history',
      icon: Clock,
    },
    {
      title: 'Payments',
      href: '/dashboard/payments',
      icon: CreditCard,
    },
    {
      title: 'Analytics',
      href: '/dashboard/analytics',
      icon: BarChart3,
    },
    {
      title: 'Customers',
      href: '/dashboard/customers',
      icon: Users,
    },
    {
      title: 'Documents',
      href: '/dashboard/documents',
      icon: FileText,
    },
    {
      title: 'Settings',
      href: '/dashboard/settings',
      icon: Settings,
    },
    {
      title: 'Help',
      href: '/dashboard/help',
      icon: HelpCircle,
    },
  ];

  if (isVertical) {
    return (
      <nav className={cn('flex flex-col space-y-1', className)}>
        {items.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all hover:bg-muted',
              item.isActive
                ? 'bg-primary/10 font-medium text-primary'
                : 'text-muted-foreground hover:text-foreground'
            )}>
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        ))}
      </nav>
    );
  }

  return (
    <nav className={cn('hidden md:flex items-center space-x-6', className)}>
      {items.slice(0, 5).map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-1 text-sm font-medium transition-colors hover:text-primary',
            item.isActive ? 'text-primary' : 'text-muted-foreground'
          )}>
          <item.icon className="h-4 w-4" />
          {item.title}
        </Link>
      ))}
    </nav>
  );
}
