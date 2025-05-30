import { Button } from '@/components/ui/button';
import { useChatActions } from '@/hooks/use-chat-actions';
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

export const GrowlyButton = ({
  children,
  onClick,
  triggerMessage,
  withUserMessage,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  triggerMessage: string;
  withUserMessage?: boolean;
}) => {
  const [loading, setLoading] = useState(false);
  const { sendUserMessage, generateAgentMessage } = useChatActions();
  const handleClick = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (withUserMessage) {
        await sendUserMessage(triggerMessage);
      } else {
        await generateAgentMessage(triggerMessage);
      }
      onClick?.(e);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };
  return (
    <Button onClick={handleClick} disabled={loading} {...props}>
      {loading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {loading ? null : children}
    </Button>
  );
};
