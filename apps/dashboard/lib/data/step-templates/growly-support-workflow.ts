import { v4 as uuid } from 'uuid';

import { ConditionType, ParsedStep, Status } from '@getgrowly/core';

export const generateGrowlySuiteWorkflowSteps = (): ParsedStep[] => {
  const stepId1 = uuid();
  const stepId2 = uuid();
  const stepId3 = uuid();

  return [
    {
      id: stepId1,
      name: 'Welcome Message',
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
          return: {
            text: '👋 Welcome to Growly Suite — your control center for managing AI agents and workflows.',
          },
        },
      ],
      workflow_id: 'growly-suite-landing',
      created_at: new Date().toISOString(),
      description: 'Intro message shown on the Growly Suite landing page.',
      index: 0,
      status: Status.Active,
    },
    {
      id: stepId2,
      name: 'What is Growly Suite?',
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
          return: {
            text: '📦 Growly Suite makes it simple to deploy, monitor, and collaborate with AI agents — all in one dashboard.',
          },
        },
      ],
      workflow_id: 'growly-suite-landing',
      created_at: new Date().toISOString(),
      description: 'Brief explanation of what Growly Suite does.',
      index: 1,
      status: Status.Active,
    },
    {
      id: stepId3,
      name: 'Manage Workflows Easily',
      is_beast_mode: true,
      is_repeat: false,
      conditions: [
        {
          id: uuid(),
          type: ConditionType.Step,
          data: stepId2,
        },
      ],
      action: [
        {
          id: uuid(),
          type: 'text',
          return: {
            text: '🛠️ With visual tools and intuitive workflows, managing complex logic is a breeze — no code required.',
          },
        },
      ],
      workflow_id: 'growly-suite-landing',
      created_at: new Date().toISOString(),
      description: 'Highlights the no-code workflow management capability.',
      index: 2,
      status: Status.Active,
    },
  ];
};
