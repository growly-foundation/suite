import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ComponentTheme as ComponentThemeReact } from '@/types/suite';
import { useContext } from 'react';

import { AppContext } from '../AppProvider';

export function ComponentTheme() {
  const { componentTheme, setComponentTheme } = useContext(AppContext);

  return (
    <div className="grid gap-2">
      <Label htmlFor="theme">Component Theme</Label>
      <Select
        defaultValue={componentTheme}
        value={componentTheme}
        onValueChange={(value: ComponentThemeReact) => {
          // Radix bug:
          // https://github.com/radix-ui/primitives/issues/3135
          if (!value) {
            return;
          }

          if (setComponentTheme) setComponentTheme(value);
        }}>
        <SelectTrigger id="theme">
          <SelectValue placeholder="Select theme" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="monoTheme">Mono Theme</SelectItem>
          <SelectItem value="defaultTheme">Default Theme</SelectItem>
          <SelectItem value="defaultDarkTheme">Default Dark Theme</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
