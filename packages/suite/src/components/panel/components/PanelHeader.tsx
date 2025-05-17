import { Button } from '@/components/ui/button';
import { cn, text } from '@/styles/theme';
import { BRAND_NAME_CAPITALIZED } from '@getgrowly/ui';
import { X } from 'lucide-react';
import { useSuiteSession } from '@/hooks/use-session';

export const PanelHeader = () => {
  const { togglePanel, agent } = useSuiteSession();
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center space-x-3">
        {/* <AgentAvatar /> */}
        <div>
          <h2 className={cn('font-semibold', text.headline)}>
            {agent?.name ?? `${BRAND_NAME_CAPITALIZED} Copilot`}
          </h2>
          <p className={cn('text-sm opacity-90', text.base)}>Typically replies in a few minutes</p>
        </div>
      </div>
      <Button variant="ghost" size="icon" onClick={togglePanel} style={{ cursor: 'pointer' }}>
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};
