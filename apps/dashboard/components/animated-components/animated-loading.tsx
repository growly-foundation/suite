'use client';

import animationData from '@/assets/animation/loading.json';
import dynamic from 'next/dynamic';

const Lottie = dynamic(() => import('react-lottie'), { ssr: false });

export const AnimatedLoading = () => {
  return (
    <div className="flex items-center justify-center h-screen">
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
        height={300}
        width={300}
      />
    </div>
  );
};
