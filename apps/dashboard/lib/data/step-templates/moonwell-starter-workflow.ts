import { v4 as uuid } from 'uuid';

import { ConditionType, ParsedStep, Status } from '@getgrowly/core';

export const generateMoonwellWorkflowSteps = (): ParsedStep[] => {
  const step1 = uuid();
  const step2 = uuid();

  return [
    {
      id: step1,
      name: 'Moonwell Onboarding',
      is_beast_mode: false,
      conditions: [{ id: uuid(), type: ConditionType.Always, data: true }],
      action: [
        {
          id: uuid(),
          type: 'text',
          return: { text: 'Welcome to Moonwell – secure lending and borrowing on Moonbeam.' },
        },
      ],
      workflow_id: 'workflow-moonwell',
      created_at: new Date().toISOString(),
      description: 'Welcome message for Moonwell users.',
      index: 0,
      status: Status.Active,
      is_repeat: false,
    },
    {
      id: step2,
      name: 'Suggest Stablecoin Pool',
      is_beast_mode: true,
      conditions: [
        {
          id: uuid(),
          type: ConditionType.JudgedByAgent,
          data: {
            stepId: step2,
            agentId: 'agent-moonwell-1',
            prompt: 'Should we recommend the stablecoin lending pool now?',
          },
        },
      ],
      action: [
        {
          id: uuid(),
          type: 'agent',
          args: {
            prompt: 'Find best-performing stablecoin lending pool.',
          },
          return: {
            id: uuid(),
            type: 'text',
            return: {
              text: 'We recommend checking out the USDC lending pool – stable and rewarding.',
            },
          },
        },
      ],
      workflow_id: 'workflow-moonwell',
      created_at: new Date().toISOString(),
      description: 'Intelligent suggestion based on user activity.',
      index: 1,
      status: Status.Active,
      is_repeat: false,
    },
  ];
};
