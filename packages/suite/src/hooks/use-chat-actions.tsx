import { AgentChatResponse, chatService } from '@/services/chat.service';
import { suiteCoreService } from '@/services/core.service';
import { Screen } from '@/types/screen';
import React from 'react';
import { toast } from 'sonner';

import {
  ConversationRole,
  MessageContent,
  SystemErrorMessageContent,
  TextMessageContent,
} from '@getgrowly/core';

import { useSuiteSession } from './use-session';
import { useSuite } from './use-suite';

export const useChatActions = () => {
  const {
    user,
    setIsAgentThinking,
    addMessage,
    setBusterState,
    inputValue,
    setInputValue,
    setPanelOpen,
    setScreen,
  } = useSuiteSession();
  const { agentId } = useSuite();
  const [isSending, setIsSending] = React.useState(false);

  /**
   * Send a message to the remote database
   * @param type The type of the message
   * @param message The content of the message
   * @param sender The sender of the message
   */
  const sendRemoteMessage = async (
    type: MessageContent['type'],
    message: MessageContent['content'],
    sender: ConversationRole
  ) => {
    const serializedContent = JSON.stringify({
      type,
      content: message,
    });
    const newMessage = await suiteCoreService.callDatabaseService('messages', 'create', [
      {
        content: serializedContent,
        sender,
        agent_id: agentId,
        user_id: user?.id,
      },
    ]);

    const deserializedMessage = {
      ...newMessage,
      ...JSON.parse(newMessage.content),
    };
    addMessage(deserializedMessage);
  };

  const sendTextMessage = (message: TextMessageContent['content'], sender: ConversationRole) => {
    sendRemoteMessage('text', message, sender);
  };

  const sendErrorMessage = (
    message: SystemErrorMessageContent['content'],
    sender: ConversationRole
  ) => {
    sendRemoteMessage('system:error', message, sender);
  };

  const navigateChatScreen = () => {
    setPanelOpen(true);
    setScreen(Screen.Chat);
  };

  /**
   * Send a message on behalf of the user.
   * @param input The content of the message
   */
  const sendUserMessage = async (input: TextMessageContent['content']) => {
    if (isSending) return;
    if (!agentId || !user?.id) {
      toast.error('Failed to send message');
      return;
    }
    if (input.trim().length > 0) {
      navigateChatScreen();

      setIsSending(true);
      setInputValue('');

      sendTextMessage(input, ConversationRole.User);
      await generateAgentMessage(input);

      setIsSending(false);
    }
  };

  /**
   * Send a message on behalf of the agent.
   * @param input The content of the message
   * @param isError Whether the message is an error message
   */
  const textAgentMessage = async (input: AgentChatResponse, isError?: boolean) => {
    navigateChatScreen();
    if (isError) {
      await sendErrorMessage(input.agent, ConversationRole.Agent);
    } else {
      await sendTextMessage(input.agent, ConversationRole.Agent);
    }
    for (const tool of input.tools) {
      setTimeout(() => {
        sendRemoteMessage(tool.type, tool.content, ConversationRole.Agent);
      }, 500);
    }
  };

  /**
   * Generate an agent message. This will send a message on behalf of the user and trigger the agent to respond.
   * @param input The content of the message
   */
  const generateAgentMessage = async (input: TextMessageContent['content']) => {
    if (!agentId || !user?.id) {
      toast.error('Failed to send message');
      return;
    }
    navigateChatScreen();
    setIsAgentThinking(true);
    setBusterState('writing');
    try {
      const newMessage = await chatService.chat({
        message: input,
        agentId,
        userId: user.id ?? '',
        stepId: agentId,
        isBeastMode: false,
      });
      textAgentMessage(newMessage.reply);
    } catch (error: any) {
      toast.error(`Failed to send message: ${error.message}`);
      textAgentMessage(error.toString(), true);
    } finally {
      setIsAgentThinking(false);
      setBusterState('idle');
    }
  };

  /**
   * Send a message on behalf of the user.
   */
  const sendMessage = () => {
    sendUserMessage(inputValue);
  };

  return {
    sendMessage,
    isSending,
    generateAgentMessage,
    textAgentMessage,
    sendUserMessage,
  };
};
