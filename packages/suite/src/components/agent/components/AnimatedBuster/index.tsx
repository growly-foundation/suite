import hoverAnimation from '@/assets/animation/hover.json';
import idleAnimation from '@/assets/animation/idling.json';
import writingAnimation from '@/assets/animation/writing.json';
import { LottieOptions, useLottie } from 'lottie-react';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { useState } from 'react';

export type BusterState = 'idle' | 'hover' | 'writing';

export const AnimatedBuster = ({
  width,
  height,
  state,
  setState,
}: {
  width?: number;
  height?: number;
  state?: BusterState;
  setState?: (state: BusterState) => void;
}) => {
  const [internalState, setInternalState] = useState<BusterState>(state || 'idle');

  const handleStateChange = (newState: BusterState) => {
    setInternalState(newState);
    setState?.(newState);
  };

  const options: LottieOptions<'svg'> = useMemo(() => {
    let animationData;
    switch (internalState) {
      case 'idle':
        animationData = idleAnimation;
        break;
      case 'hover':
        animationData = hoverAnimation;
        break;
      case 'writing':
        animationData = writingAnimation;
        break;
    }

    return {
      animationData,
      loop: true,
      autoplay: true,
      width,
      height,
      onComplete: () => {
        if (internalState === 'hover') {
          handleStateChange('idle');
        }
      },
    };
  }, [internalState]);

  useEffect(() => {
    if (state) {
      setInternalState(state);
    }
  }, [state]);

  const { View } = useLottie(options);

  return (
    <div
      style={{ width, height }}
      onMouseEnter={() => handleStateChange('hover')}
      onMouseLeave={() => handleStateChange('idle')}
      onTouchStart={() => handleStateChange('writing')}
      onTouchEnd={() => handleStateChange('idle')}>
      {View}
    </div>
  );
};
