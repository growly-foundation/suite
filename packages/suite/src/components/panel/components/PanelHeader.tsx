import { Button } from '@/components/ui/button';
import { useSuiteSession } from '@/hooks/use-session';
import { cn, text } from '@/styles/theme';
import { X } from 'lucide-react';

import { AnimatedBuster, BRAND_NAME_CAPITALIZED } from '@getgrowly/ui';

export const PanelHeader = () => {
  const { togglePanel, agent, isAgentThinking } = useSuiteSession();
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        <AnimatedBuster width={40} height={40} state={isAgentThinking ? 'writing' : 'idle'} />
        <div>
          <h2 className={cn('font-semibold', text.headline)}>
            {agent?.name ?? `${BRAND_NAME_CAPITALIZED} Copilot`}
          </h2>
          <p className={cn('text-sm opacity-90 transition-opacity duration-300', text.base)}>
            {isAgentThinking ? 'Thinking...' : 'Typically replies in a few minutes'}
          </p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={togglePanel} style={{ cursor: 'pointer' }}>
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};
