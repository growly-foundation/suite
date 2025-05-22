import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { border, pressable, text } from '@/styles/theme';
import { Button } from '@/components/ui/button';
import { Loader2, LucideSend } from 'lucide-react';
import { useSuiteSession } from '@/hooks/use-session';
import { useThemeStyles } from '@/hooks/use-theme-styles';

export const ChatInput = ({
  sendMessageHandler,
  isSending,
}: {
  sendMessageHandler: () => void;
  isSending: boolean;
}) => {
  const styles = useThemeStyles();
  const { inputValue, setInputValue, isAgentThinking } = useSuiteSession();

  // If "ENTER" is clicked, send a message.
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault(); // ⛔ prevent new line
      sendMessageHandler();
      setInputValue('');
    }
  };

  return (
    <div className={cn('p-4 border-t', border.lineDefault)} style={styles.chat.input}>
      <div className={cn('flex space-x-2', text.body)}>
        <Textarea
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isAgentThinking}
          required
          placeholder={isAgentThinking ? 'Agent is thinking...' : 'Send a message...'}
          style={{
            border: 'none',
            backgroundColor: styles.chat.input.backgroundColor,
            color: styles.chat.input.color,
          }}
          className={cn(
            'flex-1',
            border.lineDefault,
            text.body,
            'placeholder:text-gray-500 text-sm placeholder:text-sm focus:outline-none focus:ring-0'
          )}
        />
        <Button
          className={cn(border.defaultActive, pressable.inverse, text.headline)}
          style={{
            color: styles.text.inverse.color,
            borderRadius: '50%',
            width: '40px',
            height: '40px',
          }}
          onClick={sendMessageHandler}
          disabled={isAgentThinking || isSending}>
          {isSending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <LucideSend className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
