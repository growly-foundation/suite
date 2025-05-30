import { WORKFLOW_TEMPLATES } from '@/lib/data/step-templates';
import { SquareStackIcon } from 'lucide-react';

import { ParsedStep } from '@getgrowly/core';

import { Button } from '../ui/button';
import { Card, CardDescription, CardTitle } from '../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';

export type Template = {
  id: string;
  name: string;
  description: string;
  logoUrl: string;
  steps: ParsedStep[];
};

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
        <Button size={'sm'} className="flex items-center gap-2">
          <SquareStackIcon className="mr-2 h-4 w-4" />
          Templates
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-[900px]">
        <DialogHeader>
          <DialogTitle>Templates</DialogTitle>
          <DialogDescription>
            Browse through a collection of community-created workflow templates.
          </DialogDescription>
        </DialogHeader>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {WORKFLOW_TEMPLATES.map(template => (
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
