'use client';

import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

import { Button } from '../ui/button';

export const NewAgentButton = () => {
  return (
    <Link href="/dashboard/agents/new">
      <Button variant="outline" className="w-full justify-start">
        <PlusCircle className="mr-2 h-4 w-4" />
        New Agent
      </Button>
    </Link>
  );
};
