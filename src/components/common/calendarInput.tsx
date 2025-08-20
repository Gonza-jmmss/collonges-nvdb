"use client";

import * as React from "react";
import Icon from "@/components/common/icon";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import frFR from "@/lang/fr-FR";

function formatDate(date: Date | undefined, short: boolean) {
  if (!date) {
    return "";
  }
  let value;
  short
    ? (value = date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        year: "2-digit",
      }))
    : (value = date.toLocaleDateString("fr-FR", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }));
  return value;
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export default function CalendarInput({
  dateValue,
  setDateValue,
  disabled,
  variant,
  short,
  //   noMaxYearValidation,
}: {
  dateValue: Date | undefined;
  setDateValue: (date: Date) => void;
  variant?: string;
  short?: boolean;
  disabled?: boolean;
  //   noMaxYearValidation?: boolean;
}) {
  const t = frFR;

  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");

  // Sync input value with dateValue prop
  React.useEffect(() => {
    setInputValue(formatDate(dateValue, short ? short : false));
  }, [dateValue]);

  // Calendar month should follow the selected date or default to current month
  const calendarMonth = dateValue || new Date();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);

    // Try to parse the input as a date
    const parsedDate = new Date(newValue);
    if (isValidDate(parsedDate)) {
      setDateValue(parsedDate);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDateValue(selectedDate);
      setInputValue(formatDate(selectedDate, short ? short : false));
    }
    setOpen(false);
  };

  return (
    <div className="flex w-full flex-col gap-3">
      <div
        className={`relative flex w-full gap-2 rounded-md ${variant && variant === "outlineColored" ? "border border-primary" : ""}`}
      >
        <Input
          id="date"
          value={inputValue}
          placeholder={t.shared.dateInput.dateInput}
          className="w-full bg-transparent pr-10"
          onChange={handleInputChange}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              e.preventDefault();
              setOpen(true);
            }
          }}
          disabled={disabled}
        />
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              id="date-picker"
              variant="ghost"
              className="absolute right-0 top-1/2 size-[2rem] -translate-y-1/2"
              disabled={disabled}
            >
              <Icon name="MdCalendarMonth" className="cursor-pointer text-xl" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="w-auto overflow-hidden p-0"
            align="end"
            alignOffset={-8}
            sideOffset={10}
          >
            <Calendar
              mode="single"
              selected={dateValue}
              captionLayout="dropdown"
              onSelect={handleDateSelect}
            />
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
}
