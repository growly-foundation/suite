import { v4 as uuid } from 'uuid';

import { ConditionType, ParsedStep, Status } from '@getgrowly/core';

export const generateMorphoWorkflowSteps = (): ParsedStep[] => {
  const step1 = uuid();
  const step2 = uuid();
  const step3 = uuid();

  return [
    {
      id: step1,
      name: 'Welcome to Morpho',
      is_beast_mode: false,
      conditions: [{ id: uuid(), type: ConditionType.Always, data: true }],
      action: [
        {
          id: uuid(),
          type: 'text',
          return: { text: 'Welcome to Morpho! Earn more by lending peer-to-peer.' },
        },
      ],
      workflow_id: 'workflow-morpho',
      created_at: new Date().toISOString(),
      description: 'Intro to P2P lending.',
      index: 0,
      status: Status.Active,
      is_repeat: false,
    },
    {
      id: step2,
      name: 'Explain Lending vs Supplying',
      is_beast_mode: false,
      conditions: [
        {
          id: uuid(),
          type: ConditionType.Step,
          data: step1,
        },
      ],
      action: [
        {
          id: uuid(),
          type: 'text',
          return: {
            text: 'Morpho matches you with better rates by bypassing pools. Choose between lending or supplying.',
          },
        },
      ],
      workflow_id: 'workflow-morpho',
      created_at: new Date().toISOString(),
      description: 'Help user understand how Morpho improves yield.',
      index: 1,
      status: Status.Active,
      is_repeat: false,
    },
    {
      id: step3,
      name: 'Ask Agent for Lending Suggestion',
      is_beast_mode: true,
      conditions: [
        {
          id: uuid(),
          type: ConditionType.JudgedByAgent,
          data: {
            stepId: step3,
            agentId: 'agent-morpho-1',
            prompt: 'Is it a good time for this user to lend assets?',
          },
        },
      ],
      action: [
        {
          id: uuid(),
          type: 'agent',
          args: {
            prompt: 'Evaluate if lending now yields optimal returns.',
          },
          return: {
            id: uuid(),
            type: 'text',
            return: { text: 'Looks like now is a great time to lend!' },
          },
        },
      ],
      workflow_id: 'workflow-morpho',
      created_at: new Date().toISOString(),
      description: 'Smart suggestion on whether to lend.',
      index: 2,
      status: Status.Active,
      is_repeat: false,
    },
  ];
};
