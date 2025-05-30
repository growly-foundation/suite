import { Tables } from '@/types/database.types';
import { Token } from '@coinbase/onchainkit/token';

export type Message = Tables<'messages'>;
export type ParsedMessage = Omit<Message, 'content'> & MessageContent;
export type ParsedMessageInsert = Omit<Message, 'id' | 'created_at'> & MessageContent;

/**
 * Role of the participant in the conversation.
 */
export enum ConversationRole {
  User = 'user',
  Agent = 'assistant',
  System = 'system',
}

/**
 * Content of the message.
 */
export type MessageContent =
  | TextMessageContent
  | SystemErrorMessageContent
  | OnchainKitMessageContent
  | UniswapSwapMessageContent;

/**
 * Text message content.
 */
export interface TextMessageContent {
  type: 'text';
  content: string;
}

/**
 * System error message content.
 */
export interface SystemErrorMessageContent {
  type: 'system:error';
  content: string;
}

/**
 * OnchainKit message content.
 */
export type OnchainKitMessageContent = OnchainKitSwapMessageContent | OnchainKitTokenMessageContent;

/**
 * OnchainKit swap message content.
 */
export interface OnchainKitSwapMessageContent {
  type: 'onchainkit:swap';
  content: {
    fromToken: Token;
    toToken: Token;
    swappableTokens: Token[];
  };
}

/**
 * OnchainKit token message content.
 */
export interface OnchainKitTokenMessageContent {
  type: 'onchainkit:token';
  content: {
    token: Token;
  };
}

export interface UniswapSwapTokenInfo {
  symbol: string;
  name: string;
  chain: string;
  address: string | null;
  value: number;
  percentage: number;
  type: string;
  price: number;
  quantity: number;
}

/**
 * Uniswap swap message content.
 */
export interface UniswapSwapMessageContent {
  type: 'uniswap:swap';
  content: {
    fromToken: UniswapSwapTokenInfo;
    toToken: UniswapSwapTokenInfo;
    link?: string;
  };
}
