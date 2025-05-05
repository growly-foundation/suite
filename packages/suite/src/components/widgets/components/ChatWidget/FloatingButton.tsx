'use client';

import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useSuite } from '@/provider';
import { BRAND_LOGO_URL, BRAND_NAME_CAPITALIZED } from '@/constants';
import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { background, border, pressable, text } from '@/styles/theme';

export function FloatingButton(
  props: React.ButtonHTMLAttributes<HTMLButtonElement> & { iconLoading?: boolean }
) {
  const { config } = useSuite();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-[9990]">
      <TooltipProvider>
        <Tooltip open={isHovered} delayDuration={1}>
          <motion.div
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}>
            <TooltipTrigger
              {...props}
              style={{
                cursor: 'pointer',
                width: 50,
                height: 50,
                position: 'relative',
              }}
              className={cn(
                'border border-primary/10 rounded-full aspect-square shadow-3xl text-white',
                pressable.coinbaseBranding
              )}>
              <Avatar style={{ width: 50, height: 50 }} className={border.linePrimary}>
                <AvatarImage src={BRAND_LOGO_URL} />
                <AvatarFallback>🤖</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
          </motion.div>
          <TooltipContent className={cn(text.base, background.default)}>
            <p>
              Needs help? Chat with {config?.agent?.name ?? `${BRAND_NAME_CAPITALIZED} Copilot`}
            </p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
