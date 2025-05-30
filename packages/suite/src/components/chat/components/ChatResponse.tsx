import { RenderMessage } from '@/components/messages';
import { useTheme } from '@/components/providers/ThemeProvider';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { text } from '@/styles/theme';
import { motion } from 'framer-motion';

import { ConversationRole, ParsedMessage } from '@getgrowly/core';

const AgentResponse = ({ message }: { message: ParsedMessage }) => {
  const { theme } = useTheme();
  return (
    <motion.div
      id={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex space-x-2"
      style={{ marginBottom: 10 }}>
      <Card
        className={cn('py-2 px-4 mb-2', text.body)}
        style={{
          backgroundColor: theme.background.paper,
          color: theme.text.primary,
          border: 'none',
          boxShadow: 'none',
        }}>
        <RenderMessage message={message} />
      </Card>
    </motion.div>
  );
};

const UserResponse = ({ message }: { message: ParsedMessage }) => {
  const { theme } = useTheme();
  return (
    <motion.div
      id={message.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="flex"
      style={{ marginBottom: 10, justifyContent: 'flex-end' }}>
      <Card
        className={cn('py-2 px-4 mb-2 max-w-[80%]', text.body)}
        style={{
          backgroundColor: theme.background.default,
          color: theme.text.primary,
          borderColor: theme.ui.border.default,
          borderRadius: theme.radius.lg,
        }}>
        <RenderMessage message={message} />
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
