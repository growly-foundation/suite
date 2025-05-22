import { cn } from '@/lib/utils';
import { text } from '@/styles/theme';
import { BRAND_NAME_CAPITALIZED } from '@getgrowly/ui';
import { ChevronUp, Loader2, Pencil } from 'lucide-react';
import ChatResponse from './ChatResponse';
import { useSuiteSession } from '@/hooks/use-session';
import React from 'react';
import { Button } from '@/components/ui/button';

export const ChatMessageView = () => {
  const { messages, agent, isLoadingMessages, isAgentThinking, panelOpen } = useSuiteSession();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  // Number of messages to show initially and when loading more
  const MESSAGES_PER_PAGE = 5;

  // State to track how many messages are currently visible
  const [visibleMessageCount, setVisibleMessageCount] = React.useState(MESSAGES_PER_PAGE);

  // Calculate visible messages based on the count
  const visibleMessages = React.useMemo(() => {
    if (messages.length <= visibleMessageCount) {
      return messages;
    }
    return messages.slice(messages.length - visibleMessageCount);
  }, [messages, visibleMessageCount]);

  // Handle loading more messages
  const loadPreviousMessages = () => {
    setVisibleMessageCount(prev => Math.min(prev + MESSAGES_PER_PAGE, messages.length));
  };

  // Scroll to bottom when messages change or when visible message count changes
  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    const element = document.getElementById('thinking-status');
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  }, [messages, panelOpen]);

  return (
    <React.Fragment>
      {messages.length > 0 && (
        <React.Fragment>
          <div
            className={cn('text-gray-500 text-xs text-center', text.base)}
            style={{ padding: '20px 0px 30px 0px' }}>
            You are chatting with {agent?.name ?? `${BRAND_NAME_CAPITALIZED} Copilot`}
          </div>
        </React.Fragment>
      )}
      {!isLoadingMessages ? (
        <React.Fragment>
          {messages.length > 0 ? (
            <React.Fragment>
              {messages.length > visibleMessageCount && (
                <div className="flex justify-center my-4">
                  <Button
                    onClick={loadPreviousMessages}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-1">
                    <ChevronUp className="h-4 w-4" />
                    Load previous messages
                  </Button>
                </div>
              )}
              {visibleMessages.map(message => (
                <ChatResponse key={message.id} message={message} />
              ))}
              <div ref={messagesEndRef} />
            </React.Fragment>
          ) : (
            <div className={cn('p-[50px] text-gray-500', text.body)}>
              <div style={{ marginBottom: '10px' }}>
                <Pencil className="h-6 w-6 mr-2" />
              </div>
              <div className={cn('mt-2', text.body)}>
                This conversation just started. Send a message to get started.
              </div>
            </div>
          )}
        </React.Fragment>
      ) : (
        <div
          className={cn('flex justify-center items-center text-gray-500 gap-4', text.body)}
          style={{ marginTop: 50 }}>
          <Loader2 className="h-5 w-5 animate-spin" /> Loading conversation...
        </div>
      )}
      {isAgentThinking && (
        <div
          id="thinking-status"
          className={cn('flex justify-center items-center text-gray-500 gap-4', text.body)}
          style={{ marginTop: 50, marginBottom: 50 }}>
          <Loader2 className="h-5 w-5 animate-spin" /> Thinking...
        </div>
      )}
    </React.Fragment>
  );
};
