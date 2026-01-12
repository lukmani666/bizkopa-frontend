'use client';

import { useEffect, useState } from "react";
import { Building2, Check, ChevronsUpDown, Plus } from "lucide-react";
import { cn } from "../lib/utils";
import { Button } from "../ui/button";
import { 
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
import { 
  Popover ,
  PopoverContent,
  PopoverTrigger
} from "../ui/popover";
import { useBusinessStore } from "@/stores/business.store";
import { CreateBusinessDialog } from "./create-business-dialog";

export function BusinessSwitcher() {
  const [open, setOpen] = useState(false);

  const {
    businesses, 
    activeBusiness,
    fetchBusinesses,
    setActiveBusiness,
    isLoading,
  } = useBusinessStore();

  useEffect(() => {
    fetchBusinesses();
  }, [])

  const handleSelect = (businessId: string) => {
    const selected = businesses.find(
      (b) => String(b._id) === businessId
    );

    if (selected) {
      setActiveBusiness(selected);
    }

    setOpen(false);
  };

  if (isLoading) {
    return (
      <Button
        variant="outline"
        className="w-50 justify-between"
        disabled
      >
        <span className="flex items-center gap-2">
          <Building2 className="h-4 w-4" />
          Loading...
        </span>
      </Button>
    );
  }

  if (businesses.length === 0) {
    return <CreateBusinessDialog />;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          aria-label="Select a business"
          className="w-50 justify-between"
        >
          <span className="flex items-center gap-2 truncate">
            <Building2 className="h-4 w-4 shrink-0" />
            <span className="truncate">
              {activeBusiness?.name || 'Select business'}
            </span>
          </span>

          <ChevronsUpDown className="ml-auto h-4 w-4 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-50 p-0">
        <Command>
          <CommandInput placeholder="Search business..." />

          <CommandList>
            <CommandEmpty>No business found.</CommandEmpty>

            <CommandGroup heading="Businesses">
              {businesses.map((business) => (
                <CommandItem
                  key={String(business._id)}
                  onSelect={() =>
                    handleSelect(String(business._id))
                  }
                  className="text-sm"
                >
                  <Building2 className="mr-2 h-4 w-4" />

                  <span className="truncate">
                    {business.name}
                  </span>

                  <Check
                    className={cn(
                      'ml-auto h-4 w-4',
                      String(activeBusiness?._id) ===
                        String(business._id)
                        ? 'opacity-100'
                        : 'opacity-0'
                    )}
                  />
                </CommandItem>
              ))}
            </CommandGroup>

            <CommandSeparator />
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}