'use client';

import { useSuite } from '@/hooks/use-suite';
import moment from 'moment';
import React, { useEffect, useState } from 'react';

import { ConversationRole, ParsedMessage } from '@getgrowly/core';

import { buildOnchainKitSwapMessage, buildOnchainKitTokenChipMessage } from './onchainkit';
import { buildSystemErrorMessage } from './system';
import { buildMarkdownMessage } from './system/markdown';
import { buildTextMessage } from './system/text';
import { buildUniswapSwapMessage } from './uniswap';

export const RenderMessage = ({ message }: { message: ParsedMessage }) => {
  const [time, setTime] = useState(moment(message.created_at).fromNow());

  useEffect(() => {
    setTime(moment(message.created_at).fromNow());
  }, [moment(message.created_at).minutes()]);

  return (
    <React.Fragment>
      <RenderMessageContent message={message} />
      <span className="text-xs opacity-50">{time}</span>
    </React.Fragment>
  );
};

export const RenderMessageContent = ({ message }: { message: ParsedMessage }) => {
  if (message.type === 'text') {
    if (message.sender === ConversationRole.User) {
      return buildTextMessage(message.content);
    }
    return buildMarkdownMessage(message.content);
  }
  if (message.type === 'system:error') {
    return buildSystemErrorMessage(message.content);
  }
  if (message.type === 'uniswap:swap') {
    return buildUniswapSwapMessage(message.content);
  }
  if (message.type.startsWith('onchainkit:')) {
    return RenderOnchainKitMessageContent({ message });
  }
};

export const RenderOnchainKitMessageContent = ({ message }: { message: ParsedMessage }) => {
  const { integration } = useSuite();
  const onchainKitEnabled = integration?.onchainKit?.enabled;
  if (!onchainKitEnabled) {
    return buildSystemErrorMessage(
      '⚠️ OnchainKit feature must be enabled to display this message.'
    );
  }
  if (message.type === 'onchainkit:swap') {
    return buildOnchainKitSwapMessage(message.content);
  }
  if (message.type === 'onchainkit:token') {
    return buildOnchainKitTokenChipMessage(message.content);
  }
  return null;
};
