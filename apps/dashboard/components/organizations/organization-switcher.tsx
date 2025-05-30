'use client';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useDashboardState } from '@/hooks/use-dashboard';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown, PlusCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function OrganizationSwitcher() {
  const { selectedOrganization, organizations, setSelectedOrganization } = useDashboardState();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between">
          <div className="flex items-center gap-2 truncate">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10">
              <span className="text-xs font-bold text-primary">
                {selectedOrganization?.name.charAt(0)}
              </span>
            </div>
            <span className="truncate">{selectedOrganization?.name}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search organization..." />
          <CommandList>
            <CommandEmpty>No organization found.</CommandEmpty>
            <CommandGroup>
              {organizations.map(org => (
                <CommandItem
                  key={org.id}
                  value={org.name}
                  onSelect={() => {
                    setSelectedOrganization(org);
                    setOpen(false);
                  }}>
                  <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary/10 mr-2">
                    <span className="text-xs font-bold text-primary">{org.name.charAt(0)}</span>
                  </div>
                  <span>{org.name}</span>
                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      selectedOrganization?.id === org.id ? 'opacity-100' : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
              <CommandItem
                className="cursor-pointer"
                onSelect={() => router.push('/organizations/')}>
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-primary mr-2">
                  <span className="text-xs font-bold text-white">
                    <PlusCircle className="h-3 w-3" />
                  </span>
                </div>
                <span>Create New Organization</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
