'use client';

import { PanelLayout } from '@/components/panel/components/PanelLayout';
import { useChatActions } from '@/hooks/use-chat-actions';
import { useSuiteSession } from '@/hooks/use-session';
import { useSuite } from '@/hooks/use-suite';
import { Address, Avatar, Badge, Identity, Name } from '@coinbase/onchainkit/identity';
import React from 'react';

import { ConversationRole, ParsedUser } from '@getgrowly/core';

import { ChatInput, ChatInputProps } from './ChatInput';
import { ChatMessageView, ChatMessageViewProps } from './ChatMessageView';
import { ConnectWallet } from './ConnectWallet';

export function ChatPanel() {
  const { integration } = useSuite();
  const {
    messages,
    user,
    agent,
    isLoadingMessages,
    isAgentThinking,
    panelOpen,
    inputValue,
    setInputValue,
  } = useSuiteSession();
  const { sendUserMessage, isSending } = useChatActions();
  return (
    <ChatPanelContainer
      user={user}
      integration={integration}
      view={{
        user,
        messages,
        agent,
        isLoadingMessages,
        isAgentThinking,
        isScrollingToBottom: panelOpen,
        viewAs: ConversationRole.User,
      }}
      input={{
        sendMessageHandler: sendUserMessage,
        isSending,
        inputValue,
        setInputValue,
        isAgentThinking,
      }}
    />
  );
}

export function ChatPanelContainer({
  integration,
  user,
  view,
  input,
}: {
  integration?: {
    onchainKit?: {
      enabled: boolean;
    };
  };
  user: ParsedUser | undefined | null;
  view: ChatMessageViewProps;
  input: ChatInputProps;
}) {
  return (
    <React.Fragment>
      {user?.entities.walletAddress ? (
        <>
          {integration?.onchainKit?.enabled && (
            <Identity address={user.entities.walletAddress} hasCopyAddressOnClick={false}>
              <Avatar />
              <Name>
                <Badge tooltip={false} />
              </Name>
              <Address />
            </Identity>
          )}
          <PanelLayout>
            <ChatMessageView {...view} />
          </PanelLayout>
          <ChatInput {...input} />
        </>
      ) : (
        <ConnectWallet />
      )}
    </React.Fragment>
  );
}
