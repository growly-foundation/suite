import { ConversationRole, ParsedMessage } from '@getgrowly/core';
import { ChatWidgetContainer } from '../ChatWidget';
import { ETHToken, USDCToken } from './tokens';
import { useEffect } from 'react';
import { useSuiteSession } from '@/hooks/use-session';

const mockMessages: ParsedMessage[] = [
  {
    id: 'message-1',
    type: 'text',
    agent_id: '1',
    user_id: '1',
    embedding: null,
    content: 'Hi, How are you?',
    sender: ConversationRole.User,
    created_at: new Date().toISOString(),
  },
  {
    id: 'message-2',
    type: 'text',
    agent_id: '1',
    user_id: '1',
    embedding: null,
    content: 'I am doing great, thank you for asking!',
    sender: ConversationRole.Agent,
    created_at: new Date().toISOString(),
  },
  {
    id: 'message-3',
    type: 'text',
    agent_id: '1',
    user_id: '1',
    embedding: null,
    content: 'That is so cool! I was worried that you might be having a bad day.',
    sender: ConversationRole.User,
    created_at: new Date().toISOString(),
  },
  {
    id: 'message-4',
    type: 'text',
    agent_id: '1',
    user_id: '1',
    embedding: null,
    content:
      'No, I am doing great. I have a lot of amazing conversations with users like you. I am also learning a lot from them. Did you know that DeFi (Decentralized Finance) is a rapidly growing industry?',
    sender: ConversationRole.Agent,
    created_at: new Date().toISOString(),
  },
  {
    id: 'message-5',
    type: 'text',
    agent_id: '1',
    user_id: '1',
    embedding: null,
    content:
      'I am glad to hear that! I am also learning a lot from you. Yes, I am familiar with DeFi. I have been following it for a while now.',
    sender: ConversationRole.User,
    created_at: new Date().toISOString(),
  },
  {
    id: 'message-6',
    type: 'text',
    agent_id: '1',
    user_id: '1',
    embedding: null,
    content:
      'I am happy to help you with anything you need. I am here to assist you. Do you have any questions about DeFi?',
    sender: ConversationRole.Agent,
    created_at: new Date().toISOString(),
  },
  {
    id: 'message-7',
    type: 'text',
    agent_id: '1',
    user_id: '1',
    embedding: null,
    content: 'I have a question for you. What do you think about the potential of DeFi?',
    sender: ConversationRole.User,
    created_at: new Date().toISOString(),
  },
  {
    id: 'message-8',
    type: 'text',
    agent_id: '1',
    user_id: '1',
    embedding: null,
    content:
      'I think DeFi has a lot of potential to revolutionize the financial industry. It is a rapidly growing industry that is still in its early stages.',
    sender: ConversationRole.Agent,
    created_at: new Date().toISOString(),
  },
  {
    id: 'message-9',
    type: 'text',
    agent_id: '1',
    user_id: '1',
    embedding: null,
    content:
      'I think it is really cool how DeFi can be used to create more decentralized and secure financial systems.',
    sender: ConversationRole.User,
    created_at: new Date().toISOString(),
  },
  {
    id: 'message-10',
    type: 'text',
    agent_id: '1',
    user_id: '1',
    embedding: null,
    content: 'I am glad to hear that! DeFi is a really interesting topic.',
    sender: ConversationRole.Agent,
    created_at: new Date().toISOString(),
  },
  {
    id: 'message-11',
    type: 'onchainkit:swap',
    agent_id: '1',
    user_id: '1',
    embedding: null,
    content: {
      swappableTokens: [ETHToken, USDCToken],
      fromToken: ETHToken,
      toToken: USDCToken,
    },
    sender: ConversationRole.Agent,
    created_at: new Date().toISOString(),
  },
  {
    id: 'message-12',
    type: 'text',
    agent_id: '1',
    user_id: '1',
    embedding: null,
    content:
      'I am also learning a lot from you. Yes, I am familiar with DeFi. I have been following it for a while now.',
    sender: ConversationRole.User,
    created_at: new Date().toISOString(),
  },
  {
    id: 'message-13',
    type: 'text',
    agent_id: '1',
    user_id: '1',
    embedding: null,
    content: 'Can you discover info about Ethereum?',
    sender: ConversationRole.User,
    created_at: new Date().toISOString(),
  },
  {
    id: 'message-14',
    type: 'onchainkit:token',
    agent_id: '1',
    user_id: '1',
    embedding: null,
    content: {
      token: ETHToken,
    },
    sender: ConversationRole.Agent,
    created_at: new Date().toISOString(),
  },
  {
    id: 'message-15',
    type: 'text',
    agent_id: '1',
    user_id: '1',
    embedding: null,
    content: 'Ethereum is a decentralized platform for building and running smart contracts.',
    sender: ConversationRole.Agent,
    created_at: new Date().toISOString(),
  },
];

export function DemoChatWidget() {
  const { setMessages } = useSuiteSession();

  useEffect(() => {
    setMessages(mockMessages);
  }, []);

  return <ChatWidgetContainer />;
}
