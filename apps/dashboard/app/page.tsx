'use client';

import { AnimatedLoading } from '@/components/animated-components/animated-loading';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    redirect('/dashboard');
  }, []);
  return <AnimatedLoading />;
}
