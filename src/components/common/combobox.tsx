"use client";

import { useState } from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function Combobox({
  options,
  textAttribute,
  valueAttribute,
  placeholder,
  itemSelected,
  setItemSelected,
  showSearch,
}: {
  options: {
    [key: string]: any;
  }[];
  textAttribute: string;
  valueAttribute: string;
  placeholder: string;
  itemSelected?: any;
  setItemSelected: any;
  showSearch?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {itemSelected
            ? itemSelected[textAttribute]
            : placeholder
              ? placeholder
              : "Select..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          {showSearch && (
            <CommandInput
              placeholder={`${placeholder ? `${placeholder}...` : "Select..."}`}
              className="h-9"
            />
          )}

          <CommandList>
            <CommandEmpty>No values found.</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option[valueAttribute]}
                  value={option[valueAttribute]}
                  onSelect={(currentValue) => {
                    setItemSelected(
                      currentValue === itemSelected ? "" : option,
                    );
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex w-full items-center justify-between">
                    <div className="pr-2">{option[textAttribute]}</div>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        itemSelected &&
                          itemSelected.toString() ===
                            option[textAttribute].toString()
                          ? "opacity-100"
                          : "opacity-0",
                      )}
                    />
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
