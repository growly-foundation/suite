import { ScrollArea } from '@/components/ui/scroll-area';
import { useSuite } from '@/hooks/use-suite';
import { cn } from '@/lib/utils';

export const PanelLayout = ({ children }: { children: React.ReactNode }) => {
  const { config } = useSuite();
  return (
    <ScrollArea
      className={cn('flex-1', config?.display === 'fullView' ? 'max-h-[80vh]' : 'max-h-[70vh]')}
      style={{ padding: '0px 50px' }}
      id="chat-messages-container">
      {children}
    </ScrollArea>
  );
};
