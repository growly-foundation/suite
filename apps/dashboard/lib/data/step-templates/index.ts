import { generateBasicDeFiWorkflowSteps } from './basic-defi-workflow';
import { generateGrowlySuiteWorkflowSteps } from './growly-support-workflow';
import { generateMoonwellWorkflowSteps } from './moonwell-starter-workflow';
import { generateMorphoWorkflowSteps } from './morpho-starter-workflow';
import { generateUniswapWorkflowSteps } from './uniswap-starter-workflow';

export const WORKFLOW_TEMPLATES = [
  {
    id: 'basic-defi-workflow',
    name: 'Basic DeFi Workflow',
    description: 'A basic DeFi workflow template',
    logoUrl: '/logos/suite-logo.png',
    steps: generateBasicDeFiWorkflowSteps(),
  },
  {
    id: 'growly-suite-landing',
    name: 'Growly Suite Landing',
    description: 'A template for the Growly Suite landing page.',
    logoUrl: '/logos/suite-logo.png',
    steps: generateGrowlySuiteWorkflowSteps(),
  },
  {
    id: 'uniswap-starter-workflow',
    name: 'Uniswap Starter Workflow',
    description:
      'Introduce users to Uniswap and guide them through the process of adding liquidity.',
    logoUrl: '/templates/suite-uniswap-template.png',
    steps: generateUniswapWorkflowSteps(),
  },
  {
    id: 'morpho-starter-workflow',
    name: 'Morpho Starter Workflow',
    description:
      'Introduce users to Morpho and guide them through the process of depositing and withdrawing assets.',
    logoUrl: '/templates/suite-morpho-template.png',
    steps: generateMorphoWorkflowSteps(),
  },
  {
    id: 'moonwell-starter-workflow',
    name: 'Moonwell Starter Workflow',
    description:
      'Get started with Moonwell by guiding users through depositing and withdrawing assets in a step-by-step workflow.',
    logoUrl: '/templates/suite-moonwell-template.png',
    steps: generateMoonwellWorkflowSteps(),
  },
];
