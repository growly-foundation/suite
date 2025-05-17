import { cn } from '@/lib/utils';
import { border } from '@/styles/theme';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Loader2, Send } from 'lucide-react';
import { useSuite } from '@/hooks/use-suite';
import { LazyAnimatedBuster } from '@getgrowly/ui';
import { text, pressable } from '@/styles/theme';
import { useSuiteSession } from '@/hooks/use-session';

export const ChatInput = ({
  sendMessageHandler,
  isSending,
}: {
  sendMessageHandler: () => void;
  isSending: boolean;
}) => {
  const { config } = useSuite();
  const { busterState, setBusterState, inputValue, setInputValue } = useSuiteSession();

  // If "ENTER" is clicked, send a message.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // ⛔ prevent new line
      sendMessageHandler();
      setInputValue('');
    }
  };

  return (
    <div
      className={cn('p-4 border-t', border.lineDefault)}
      style={{ backgroundColor: config?.theme?.background }}>
      <div className={cn('flex space-x-2', text.body)}>
        <LazyAnimatedBuster state={busterState} setState={setBusterState} width={40} height={40} />
        <Textarea
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          required
          placeholder="Send a message..."
          style={{
            border: 'none',
          }}
          className={cn(
            'flex-1',
            border.lineDefault,
            'placeholder:text-gray-500 text-xs placeholder:text-xs focus:outline-none focus:ring-0'
          )}
        />
        <Button
          className={cn(border.defaultActive, pressable.inverse, text.headline)}
          style={{
            backgroundColor: config?.theme?.primary,
            color: config?.theme?.text,
            borderRadius: '50%',
            width: '40px',
            height: '40px',
          }}
          onClick={sendMessageHandler}>
          {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
};
