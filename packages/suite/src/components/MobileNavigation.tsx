'use client';

import type React from 'react';

import { Home, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Screen } from '@/types/screen';
import { useSuiteSession } from '@/hooks/use-session';
import { useTheme } from '@/components/providers/ThemeProvider';

interface NavItem {
  icon: React.ElementType;
  screen: Screen;
  label: string;
}

const navItems: NavItem[] = [
  {
    icon: Home,
    screen: Screen.Chat,
    label: 'Chat',
  },
  {
    icon: Settings,
    screen: Screen.Settings,
    label: 'Settings',
  },
];

export function MobileNavigation() {
  const { theme } = useTheme();
  const { setScreen, screen } = useSuiteSession();
  return (
    <div
      className="position-fixed bottom-0 left-0 right-0 w-full"
      style={{
        backgroundColor: theme.background.default,
        borderTopColor: theme.ui.border.default,
        borderTopWidth: 1,
      }}>
      <nav className="mx-auto flex h-14 max-w-md items-center justify-around px-4">
        {navItems.map(item => {
          const isActive = item.screen === screen;
          const IconComponent = item.icon;
          return (
            <div
              key={item.screen}
              className={cn('flex flex-col items-center justify-center')}
              style={{
                color: isActive ? theme.brand.primary : theme.text.primary,
              }}
              onClick={() => setScreen(item.screen)}>
              <IconComponent className="h-5 w-5" />
              <span className="mt-1 text-xs">{item.label}</span>
            </div>
          );
        })}
      </nav>
    </div>
  );
}
