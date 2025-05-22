import { useEffect, useState } from 'react';
import { Card, CardDescription, CardTitle } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { ParsedStep } from '@getgrowly/core';
import { generateBasicDeFiWorkflowSteps } from '@/lib/data/step-templates/basic-defi-workflow';
import { generateGrowlySuiteWorkflowSteps } from '@/lib/data/step-templates/growly-support-workflow';
import { generateUniswapWorkflowSteps } from '@/lib/data/step-templates/uniswap-starter-workflow';
import { generateMorphoWorkflowSteps } from '@/lib/data/step-templates/morpho-starter-workflow';
import { generateMoonwellWorkflowSteps } from '@/lib/data/step-templates/moonwell-starter-workflow';
import { SquareStackIcon } from 'lucide-react';

export type Template = {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  steps: ParsedStep[];
};

const TEMPLATES = [
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

export function ExploreTemplateDialog({
  open,
  onOpenChange,
  onSelectTemplate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectTemplate: (template: Template) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <SquareStackIcon className="mr-2 h-4 w-4" />
          Explore Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Explore Templates</DialogTitle>
          <DialogDescription>
            Browse through a collection of community-created workflow templates.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map(template => (
            <TemplateCard
              key={template.name}
              template={template}
              onSelect={() => onSelectTemplate(template)}
            />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function TemplateCard({ template, onSelect }: { template: Template; onSelect: () => void }) {
  return (
    <Card
      className="flex flex-col gap-2 cursor-pointer hover:bg-accent hover:text-accent-foreground transition-colors p-4"
      onClick={onSelect}>
      <img src={template.logoUrl} alt={template.name} className="w-12" />
      <CardTitle className="text-lg font-semibold">{template.name}</CardTitle>
      <CardDescription className="text-sm text-muted-foreground">
        {template.description}
      </CardDescription>
    </Card>
  );
}
