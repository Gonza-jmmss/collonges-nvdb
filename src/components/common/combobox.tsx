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
import frFR from "@/lang/fr-FR";

export default function Combobox({
  options,
  textAttribute,
  valueAttribute,
  placeholder,
  itemSelected,
  setItemSelected,
  showSearch,
  disabled,
  notClearable = false,
}: {
  options: {
    [key: string]: any;
  }[];
  textAttribute: string | string[];
  valueAttribute: string;
  placeholder: string;
  itemSelected?: any;
  setItemSelected: any;
  showSearch?: boolean;
  disabled?: boolean;
  notClearable?: boolean;
}) {
  const t = frFR;

  const [open, setOpen] = useState(false);
  const textAttributeToWork = Array.isArray(textAttribute)
    ? textAttribute[0]
    : textAttribute;

  const textAttributeToShow = Array.isArray(textAttribute)
    ? (option: any) => textAttribute.map((attr) => option[attr]).join(", ")
    : textAttribute;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="combobox"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {itemSelected
            ? itemSelected[textAttributeToWork]
            : placeholder || "Select..."}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      {/* <PopoverContent className="p-0"> */}
      <PopoverContent
        className="p-0"
        align="start"
        style={{ width: "var(--radix-popover-trigger-width)" }}
      >
        <Command>
          {showSearch && (
            <CommandInput
              placeholder={`${placeholder || "Select"}...`}
              className="h-9"
            />
          )}

          <CommandList>
            <CommandEmpty>{t.shared.noValues}</CommandEmpty>
            <CommandGroup>
              {options.map((option) => (
                <CommandItem
                  key={option[valueAttribute]}
                  value={option[valueAttribute]}
                  onSelect={() => {
                    setItemSelected(
                      // If notClearable is true, don't clear on same item selection
                      notClearable &&
                        itemSelected &&
                        itemSelected[valueAttribute] === option[valueAttribute]
                        ? itemSelected // Keep the current selection
                        : itemSelected &&
                            itemSelected[valueAttribute] ===
                              option[valueAttribute]
                          ? null // Clear selection if not notClearable
                          : option, // Select new option
                    );
                    setOpen(false);
                  }}
                  className="cursor-pointer"
                >
                  <div className="flex w-full items-center">
                    <div
                      className={cn(
                        "pr-2",
                        itemSelected &&
                          itemSelected[valueAttribute] ===
                            option[valueAttribute]
                          ? "font-medium text-primary"
                          : "",
                      )}
                    >
                      {typeof textAttributeToShow === "function"
                        ? textAttributeToShow(option)
                        : option[textAttributeToShow]}
                    </div>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4 text-primary",
                        itemSelected &&
                          itemSelected[valueAttribute] ===
                            option[valueAttribute]
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
