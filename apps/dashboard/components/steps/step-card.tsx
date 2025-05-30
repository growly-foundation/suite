'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ChevronRight, Edit, Trash2 } from 'lucide-react';

import { type ParsedStep } from '@getgrowly/core';

import { ActionItem } from './actions/action-item';
import { ConditionItem } from './conditions/condition-item';

interface StepCardProps {
  step: ParsedStep;
  onEdit: (stepId: string) => void;
  onDelete: (stepId: string) => void;
}

export function StepCard({ step, onEdit, onDelete }: StepCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{step.name}</CardTitle>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onEdit(step.id)}>
              <Edit size={16} />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-destructive hover:text-destructive"
              onClick={() => onDelete(step.id)}>
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
        <CardDescription>{step.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div>
            <h4 className="text-sm font-medium mb-1">Conditions</h4>
            {step.conditions.map(condition => (
              <ConditionItem
                key={condition.id}
                condition={condition}
                onRemove={() => {}}
                disableRemove
              />
            ))}
          </div>
          <Separator />
          <div>
            <h4 className="text-sm font-medium mb-1">Actions</h4>
            {step.action.map(action => (
              <ActionItem key={action.id} action={action} onRemove={() => {}} disableRemove />
            ))}
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-1"
          onClick={() => onEdit(step.id)}>
          <span>View Details</span>
          <ChevronRight size={16} />
        </Button>
      </CardFooter>
    </Card>
  );
}
