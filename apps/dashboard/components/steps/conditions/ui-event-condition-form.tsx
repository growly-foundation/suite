'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { generateId } from '@/lib/utils';
import { Plus } from 'lucide-react';
import { useState } from 'react';

import {
  ConditionType,
  ScalarUIEventCondition,
  UIEventCondition as UIEventConditionEnum,
} from '@getgrowly/core';

interface UIEventConditionProps {
  onAdd: (data: ScalarUIEventCondition) => void;
}

export function UIEventConditionForm({ onAdd }: UIEventConditionProps) {
  const [uiEvent, setUiEvent] = useState<UIEventConditionEnum>(UIEventConditionEnum.OnPageLoad);

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>UI Event Type</Label>
        <RadioGroup value={uiEvent} onValueChange={(value: any) => setUiEvent(value)}>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={UIEventConditionEnum.OnPageLoad} id="onPageLoad" />
            <div className="flex justify-between items-center w-full">
              <Label htmlFor="onPageLoad">On Page Load</Label>
              <p className="text-sm text-muted-foreground">When the page is loaded</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={UIEventConditionEnum.OnVisited} id="onVisited" />
            <div className="flex justify-between items-center w-full">
              <Label htmlFor="onVisited">On Visited</Label>
              <p className="text-sm text-muted-foreground">When the element is visited</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={UIEventConditionEnum.OnClicked} id="onClicked" />
            <div className="flex justify-between items-center w-full">
              <Label htmlFor="onClicked">On Clicked</Label>
              <p className="text-sm text-muted-foreground">When the element is clicked</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value={UIEventConditionEnum.OnHovered} id="onHovered" />
            <div className="flex justify-between items-center w-full">
              <Label htmlFor="onHovered">On Hovered</Label>
              <p className="text-sm text-muted-foreground">When the element is hovered</p>
            </div>
          </div>
        </RadioGroup>
      </div>
      <Button
        type="button"
        onClick={() => onAdd({ type: ConditionType.UIEvent, data: uiEvent, id: generateId() })}>
        <Plus className="mr-2 h-4 w-4" />
        Add UI Event Condition
      </Button>
    </div>
  );
}
