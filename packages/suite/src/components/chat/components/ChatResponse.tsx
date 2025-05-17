import { Card } from '@/components/ui/card';
import { ConversationRole, ParsedMessage } from '@getgrowly/core';
import { motion } from 'framer-motion';
import { useSuite } from '@/hooks/use-suite';
import { cn } from '@/lib/utils';
import {
  buildOnchainKitSwapMessage,
  buildOnchainKitTokenChipMessage,
} from '@/components/messages/onchainkit';
import { buildSystemErrorMessage } from '@/components/messages/system';
import { border, text } from '@/styles/theme';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { buildMarkdownMessage } from '@/components/messages/system/markdown';
import { buildTextMessage } from '@/components/messages/system/text';

const MessageContent = ({ message }: { message: ParsedMessage }) => {
  const { integration } = useSuite();
  const onchainKitEnabled = integration?.onchainKit?.enabled;
  const [time, setTime] = useState(moment(message.created_at).fromNow());

  const buildMessage = () => {
    if (message.type === 'text') {
      if (message.sender === ConversationRole.User) {
        return buildTextMessage(message.content);
      }
      return buildMarkdownMessage(message.content);
    }
    if (message.type === 'system:error') {
      return buildSystemErrorMessage(message.content);
    }
    if (message.type.startsWith('onchainkit:')) {
      if (!onchainKitEnabled) {
        return (
          <span className="text-sm font-semibold">
            ⚠️ OnchainKit feature must be enabled to display this message.
          </span>
        );
      }
      if (message.type === 'onchainkit:swap') {
        return buildOnchainKitSwapMessage(message.content);
      }
      if (message.type === 'onchainkit:token') {
        return buildOnchainKitTokenChipMessage(message.content);
      }
    }
  };

  useEffect(() => {
    setTime(moment(message.created_at).fromNow());
  }, [moment(message.created_at).minutes()]);

  return (
    <>
      {buildMessage()}
      <span className="text-xs opacity-50">{time}</span>
    </>
  );
};

const AgentResponse = ({ message }: { message: ParsedMessage }) => {
  const { config } = useSuite();
  return (
    <motion.div
      id={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex space-x-2"
      style={{ marginBottom: 10 }}>
      {/* <AgentAvatar width={30} height={30} /> */}
      <Card
        className={cn('p-3 bg-muted', 'max-w-[75%]', text.body, border.default)}
        style={{
          backgroundColor: config?.theme?.backgroundForeground,
          color: config?.theme?.textForeground,
        }}>
        <MessageContent message={message} />
      </Card>
    </motion.div>
  );
};

const UserResponse = ({ message }: { message: ParsedMessage }) => {
  const { config } = useSuite();
  return (
    <motion.div
      id={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex"
      style={{ marginBottom: 10, justifyContent: 'flex-end' }}>
      <Card
        className={cn('p-3 max-w-[75%]', text.body, border.default)}
        style={{
          backgroundColor: config?.theme?.secondary,
          color: config?.theme?.text,
        }}>
        <MessageContent message={message} />
      </Card>
    </motion.div>
  );
};

const ChatResponse = ({
  message,
  ref,
}: {
  message: ParsedMessage;
  ref?: React.RefObject<HTMLDivElement> | null;
}) => {
  const innerResponse =
    message.sender === ConversationRole.User ? (
      <UserResponse key={message.id} message={message} />
    ) : (
      <AgentResponse key={message.id} message={message} />
    );
  return (
    <div ref={ref} className="w-full">
      {innerResponse}
    </div>
  );
};

export default ChatResponse;
