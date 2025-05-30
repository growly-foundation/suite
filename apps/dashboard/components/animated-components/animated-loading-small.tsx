'use client';

import animationData from '@/assets/animation/pink-loading.json';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('react-lottie'), { ssr: false });

export const AnimatedLoadingSmall = () => {
  return (
    <div className="flex items-center justify-center h-[500px]">
      <div className="flex items-center justify-center gap-2">
        <Lottie
          options={{
            loop: true,
            autoplay: true,
            animationData: animationData,
            rendererSettings: {
              preserveAspectRatio: 'xMidYMid slice',
            },
          }}
          speed={2}
          height={150}
          width={150}
        />
        <p className="font-medium text-muted-foreground text-2xl">Loading...</p>
      </div>
    </div>
  );
};
