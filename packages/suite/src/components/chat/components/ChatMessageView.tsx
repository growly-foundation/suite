import { cn } from '@/lib/utils';
import { text } from '@/styles/theme';
import { BRAND_NAME_CAPITALIZED } from '@getgrowly/ui';
import { Loader2, Pencil } from 'lucide-react';
import ChatResponse from './ChatResponse';
import { useSuiteSession } from '@/hooks/use-session';
import React from 'react';

export const ChatMessageView = () => {
  const { messages, agent, isLoadingMessages, isAgentThinking, panelOpen } = useSuiteSession();
  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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
              {messages.map(message => (
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
          className={cn('flex justify-center items-center text-gray-500 gap-4', text.body)}
          style={{ marginTop: 50, marginBottom: 50 }}>
          <Loader2 className="h-5 w-5 animate-spin" /> Thinking...
        </div>
      )}
    </React.Fragment>
  );
};
