import { Tables } from '@/types/database.types';

import { Address } from '@getgrowly/persona';

import { ParsedUserPersona } from './user_personas';

export type User = Tables<'users'>;

export type ParsedUser = Omit<User, 'entities'> & {
  // TODO: Need to be associated table.
  entities: {
    walletAddress: Address;
  };
} & {
  onchainData: UserOnchainData;
  offchainData: UserOffchainData;
  chatSession: UserChatSession;
};

// TODO: Need to be fields in the database
export enum SessionStatus {
  Online = 'Online',
  Offline = 'Offline',
}

export type UserOnchainData = ParsedUserPersona;

export type UserOffchainData = {
  company?: string;
  description?: string;
};

export type UserChatSession = {
  status: SessionStatus;
  lastConversation?: {
    conversationId: string;
    agentId: string;
    messageId: string;
  };
  unread: boolean;
};
