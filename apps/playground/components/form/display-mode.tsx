import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useContext } from 'react';

import { AppContext } from '../AppProvider';

export function DisplayMode() {
  const { displayMode, setDisplayMode } = useContext(AppContext);

  return (
    <div className="grid gap-2">
      <Label htmlFor="display-mode">Display Mode</Label>
      <Select
        value={displayMode}
        onValueChange={(value: string) => {
          return setDisplayMode(value as any);
        }}>
        <SelectTrigger id="display-mode">
          <SelectValue placeholder="Select mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="panel">Panel</SelectItem>
          <SelectItem value="fullView">Full View</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
