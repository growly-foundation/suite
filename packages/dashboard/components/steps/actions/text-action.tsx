'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Plus } from 'lucide-react';

interface TextActionProps {
  onAdd: (data: any) => void;
}

export function TextAction({ onAdd }: TextActionProps) {
  const [textAction, setTextAction] = useState('');

  return (
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label htmlFor="textAction">Text Content</Label>
        <Textarea
          id="textAction"
          value={textAction}
          onChange={e => setTextAction(e.target.value)}
          placeholder="Enter the text to return"
          rows={3}
        />
      </div>
      <Button type="button" onClick={() => onAdd({ text: textAction })} disabled={!textAction}>
        <Plus className="mr-2 h-4 w-4" />
        Add Text Action
      </Button>
    </div>
  );
}
