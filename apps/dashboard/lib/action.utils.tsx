import { AgentAction, TextAction, WithId } from '@getgrowly/core';

import { generateId } from './utils';

export const buildTextAction = (textAction: string): WithId<TextAction> => ({
  id: generateId(),
  type: 'text',
  return: { text: textAction },
});

export const buildTextAgentAction = (agentAction: AgentAction['args']): WithId<AgentAction> => ({
  id: generateId(),
  type: 'agent',
  args: agentAction,
  return: buildTextAction(''),
});
