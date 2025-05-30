import { Input } from '@/components/ui/input';
import { SearchIcon } from 'lucide-react';

export function Search() {
  return (
    <div className="relative w-full max-w-[200px] lg:max-w-[280px]">
      <SearchIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search..."
        className="h-9 rounded-full border-none bg-muted pl-9 pr-4 focus-visible:ring-primary"
      />
    </div>
  );
}
