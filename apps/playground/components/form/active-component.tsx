import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SuiteComponent } from '@/types/suite';
import { useContext } from 'react';

import { AppContext } from '../AppProvider';

export function ActiveComponent() {
  const { activeComponent, setActiveComponent } = useContext(AppContext);

  return (
    <div className="grid gap-2">
      <Label htmlFor="chain">Component</Label>
      <Select
        value={activeComponent}
        onValueChange={(value: SuiteComponent) =>
          value ? setActiveComponent?.(value as SuiteComponent) : value
        }>
        <SelectTrigger>
          <SelectValue placeholder="Select component" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={SuiteComponent.ChatWidget}>Chat Widget</SelectItem>
          <SelectItem value={SuiteComponent.DemoChatWidget}>Demo Chat Widget</SelectItem>
          <SelectItem value={SuiteComponent.StaticWidget}>Static Widget</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
