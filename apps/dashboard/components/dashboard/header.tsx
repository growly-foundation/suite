import { cn } from '@/lib/utils';
import type React from 'react';

interface DashboardHeaderProps {
  heading: string;
  text?: string;
  children?: React.ReactNode;
  className?: string;
}

export function DashboardHeader({ heading, text, children, className }: DashboardHeaderProps) {
  return (
    <div className={cn('flex items-center justify-between px-2', className)}>
      <div className="grid gap-1">
        <h1 className="font-heading text-3xl md:text-4xl font-bold">{heading}</h1>
        {text && <p className="text-lg text-muted-foreground">{text}</p>}
      </div>
      {children}
    </div>
  );
}
