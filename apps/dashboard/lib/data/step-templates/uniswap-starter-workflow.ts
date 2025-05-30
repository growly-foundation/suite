import { v4 as uuid } from 'uuid';

import { ConditionType, ParsedStep, Status } from '@getgrowly/core';

export const generateUniswapWorkflowSteps = (): ParsedStep[] => {
  const step1 = uuid();
  const step2 = uuid();
  const step3 = uuid();
  const step4 = uuid();
  const step5 = uuid();

  return [
    {
      id: step1,
      name: 'Welcome to Uniswap',
      is_beast_mode: false,
      conditions: [{ id: uuid(), type: ConditionType.Always, data: true }],
      action: [
        {
          id: uuid(),
          type: 'text',
          return: { text: 'Welcome to Uniswap! Ready to swap tokens?' },
        },
      ],
      workflow_id: 'workflow-uniswap',
      created_at: new Date().toISOString(),
      description: 'Introductory message for Uniswap users.',
      index: 0,
      status: Status.Active,
      is_repeat: false,
    },
    {
      id: step2,
      name: 'Guide to Swap Interface',
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
          return: { text: 'Use the Swap tab to exchange tokens instantly.' },
        },
      ],
      workflow_id: 'workflow-uniswap',
      created_at: new Date().toISOString(),
      description: 'Introduce the user to the core swap functionality.',
      index: 1,
      status: Status.Active,
      is_repeat: false,
    },
    {
      id: step3,
      name: 'Explain Slippage Settings',
      is_beast_mode: false,
      conditions: [
        {
          id: uuid(),
          type: ConditionType.Step,
          data: step2,
        },
      ],
      action: [
        {
          id: uuid(),
          type: 'text',
          return: {
            text: 'Need to adjust slippage? Tap the settings icon to customize your tolerance.',
          },
        },
      ],
      workflow_id: 'workflow-uniswap',
      created_at: new Date().toISOString(),
      description: 'Educate user on customizing slippage tolerance.',
      index: 2,
      status: Status.Active,
      is_repeat: false,
    },
    {
      id: step4,
      name: 'Introduce Liquidity Pools',
      is_beast_mode: false,
      conditions: [
        {
          id: uuid(),
          type: ConditionType.Step,
          data: step3,
        },
      ],
      action: [
        {
          id: uuid(),
          type: 'text',
          return: {
            text: 'Want to earn fees? Add liquidity to a pool to become a liquidity provider.',
          },
        },
      ],
      workflow_id: 'workflow-uniswap',
      created_at: new Date().toISOString(),
      description: 'Prompt user to explore providing liquidity.',
      index: 3,
      status: Status.Active,
      is_repeat: false,
    },
    {
      id: step5,
      name: 'Show Add Liquidity Flow',
      is_beast_mode: false,
      conditions: [
        {
          id: uuid(),
          type: ConditionType.Step,
          data: step4,
        },
      ],
      action: [
        {
          id: uuid(),
          type: 'text',
          return: { text: 'Tap "Pool" > "Add Liquidity" to select token pairs and start earning.' },
        },
      ],
      workflow_id: 'workflow-uniswap',
      created_at: new Date().toISOString(),
      description: 'Guide user to the Add Liquidity screen.',
      index: 4,
      status: Status.Active,
      is_repeat: false,
    },
  ];
};
