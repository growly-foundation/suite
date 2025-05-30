import { v4 as uuid } from 'uuid';

import { ConditionType, ParsedStep, Status, UIEventCondition } from '@getgrowly/core';

export const generateBasicDeFiWorkflowSteps = (): ParsedStep[] => {
  const stepId1 = uuid();
  const stepId2 = uuid();
  const stepId3 = uuid();
  const stepId4 = uuid();
  return [
    {
      id: stepId1,
      name: 'Welcome to DeFi Portal',
      is_beast_mode: true,
      is_repeat: false,
      conditions: [
        {
          id: uuid(),
          type: ConditionType.Always,
          data: true,
        },
      ],
      action: [
        {
          id: uuid(),
          type: 'text',
          return: { text: 'Welcome to DeFi Swap! Let’s get you started.' },
        },
      ],
      workflow_id: 'workflow-1',
      created_at: new Date().toISOString(),
      description: 'Initial greeting for users entering the decentralized swap interface.',
      index: 0,
      status: Status.Active,
    },
    {
      id: stepId2,
      name: 'Connect Wallet Prompt',
      is_beast_mode: true,
      is_repeat: false,
      conditions: [
        {
          id: uuid(),
          type: ConditionType.Step,
          data: stepId1,
        },
      ],
      action: [
        {
          id: uuid(),
          type: 'text',
          return: { text: 'Please connect your wallet to start trading.' },
        },
      ],
      workflow_id: 'workflow-1',
      created_at: new Date().toISOString(),
      description: 'Prompt the user to connect their wallet after the welcome message.',
      index: 1,
      status: Status.Active,
    },
    {
      id: stepId3,
      name: 'Offer Yield Opportunity',
      is_beast_mode: true,
      is_repeat: false,
      conditions: [
        {
          id: uuid(),
          type: ConditionType.And,
          data: [
            {
              id: uuid(),
              type: ConditionType.Step,
              data: stepId2,
            },
            {
              id: uuid(),
              type: ConditionType.UIEvent,
              data: UIEventCondition.OnClicked,
            },
          ],
        },
      ],
      action: [
        {
          id: uuid(),
          type: 'text',
          return: { text: 'Discover high-yield farming pools now available!' },
        },
      ],
      workflow_id: 'workflow-1',
      created_at: new Date().toISOString(),
      description:
        'Once the wallet is connected and the user clicks on “Explore Pools,” show them yield opportunities.',
      index: 2,
      status: Status.Active,
    },
    {
      id: stepId4,
      name: 'Request Feedback on Swap Experience',
      is_beast_mode: true,
      is_repeat: false,
      conditions: [
        {
          id: uuid(),
          type: ConditionType.Or,
          data: [
            {
              id: uuid(),
              type: ConditionType.Step,
              data: stepId2,
            },
            {
              id: uuid(),
              type: ConditionType.JudgedByAgent,
              data: {
                stepId: stepId4,
                agentId: 'agent-1',
                prompt: 'Should we ask the user for feedback now?',
              },
            },
          ],
        },
      ],
      action: [
        {
          id: uuid(),
          type: 'agent',
          args: {
            prompt: 'Collect feedback on the swap process and user interface.',
          },
          return: {
            id: uuid(),
            type: 'text',
            return: { text: 'Thank you for helping us improve!' },
          },
        },
      ],
      workflow_id: 'workflow-1',
      created_at: new Date().toISOString(),
      description:
        'Gather user feedback either after they connect their wallet or when prompted by a support agent.',
      index: 3,
      status: Status.Active,
    },
  ];
};
