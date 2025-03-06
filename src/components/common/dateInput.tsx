"use client";

import { useState, useRef, useEffect, RefObject, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

const DateSchema = z.object({
  Day: z.number().nullable(),
  Month: z.number().nullable(),
  Year: z.number().nullable(),
});

type DateType = z.infer<typeof DateSchema>;

export default function DateInput({
  dateForm,
  setItemSelected,
  disabled,
  noMaxYearValidation,
}: {
  dateForm?: Date | null;
  setItemSelected: (date: Date) => void;
  disabled?: boolean;
  noMaxYearValidation?: boolean;
}) {
  const t = frFR;

  const [dateValues, setDateValues] = useState<DateType>({
    Day: null,
    Month: null,
    Year: null,
  });
  const [checkValidation, setCheckValidation] = useState(false);

  const dayRef = useRef<HTMLInputElement>(null);
  const monthRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (dateForm) {
      setDateValues({
        Day: dateForm.getDate(),
        Month: dateForm.getMonth() + 1, // getMonth() returns 0-11
        Year: dateForm.getFullYear(),
      });
    }
  }, []);

  const parseDateString = (value: string) => {
    const dateRegex = /^(\d{1,2})[/-](\d{1,2})[/-](\d{4})$/;
    const match = value.match(dateRegex);

    if (match) {
      const [_, day, month, year] = match;
      return {
        Day: parseInt(day),
        Month: parseInt(month),
        Year: parseInt(year),
      };
    }
    return null;
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedText = event.clipboardData.getData("text");
    const parsedDate = parseDateString(pastedText);

    if (parsedDate) {
      setDateValues(parsedDate);
    } else {
      // If not a full date, paste only in the current field
      const { name } = event.currentTarget;
      setDateValues((prev) => ({
        ...prev,
        [name]: pastedText === "" ? null : Number(pastedText),
      }));
    }
  };

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;

      // Update state
      setDateValues((prev) => ({
        ...prev,
        [name]: value === "" ? null : Number(value),
      }));

      // Determine refs and max lengths
      const inputRefs: Record<string, RefObject<HTMLInputElement>> = {
        Day: dayRef,
        Month: monthRef,
        Year: yearRef,
      };

      const maxLengths: Record<string, number> = {
        Day: 2,
        Month: 2,
        Year: 4,
      };

      // Auto focus next input when current input reaches max length
      if (
        value.length === maxLengths[name] &&
        inputRefs[name].current === document.activeElement
      ) {
        const nextInputName =
          name === "Day" ? "Month" : name === "Month" ? "Year" : "Year";

        inputRefs[nextInputName].current?.focus();
      }

      // Defocus year input when it reaches 4 digits
      if (name === "Year" && value.length === 4) {
        yearRef.current?.blur();
      }
    },
    [],
  );

  const isValidDate = (day: number, month: number, year: number) => {
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      year > 1800 &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  };

  useEffect(() => {
    if (
      dateValues.Day !== null &&
      dateValues.Month !== null &&
      dateValues.Year !== null &&
      isValidDate(dateValues.Day, dateValues.Month, dateValues.Year)
    ) {
      setItemSelected(
        new Date(dateValues.Year, dateValues.Month - 1, dateValues.Day + 1),
      );
    }

    if (
      dateValues.Day !== null &&
      dateValues.Month !== null &&
      dateValues.Year !== null
    ) {
      setCheckValidation(true);
    } else {
      setCheckValidation(false);
    }
  }, [dateValues]);

  useEffect(() => {
    if (dateValues.Day !== null && dateValues.Day > 31)
      setDateValues((prev) => ({
        ...prev,
        Day: 31,
      }));
    if (dateValues.Day !== null && dateValues.Day < 0)
      setDateValues((prev) => ({
        ...prev,
        Day: null,
      }));
  }, [dateValues.Day]);

  useEffect(() => {
    if (dateValues.Month !== null && dateValues.Month > 12)
      setDateValues((prev) => ({
        ...prev,
        Month: 12,
      }));
    if (dateValues.Month !== null && dateValues.Month < 0)
      setDateValues((prev) => ({
        ...prev,
        Month: null,
      }));
  }, [dateValues.Month]);

  useEffect(() => {
    if (
      dateValues.Year !== null &&
      !noMaxYearValidation &&
      dateValues.Year > new Date().getFullYear()
    )
      setDateValues((prev) => ({
        ...prev,
        Year: new Date().getFullYear(),
      }));
    if (dateValues.Year !== null && dateValues.Year < 0)
      setDateValues((prev) => ({
        ...prev,
        Year: null,
      }));
  }, [dateValues.Year]);

  return (
    <div>
      <div className="flex space-x-1">
        <Input
          ref={dayRef}
          id="Day"
          name="Day"
          type="number"
          max={31}
          min={1}
          maxLength={2}
          placeholder={`${t.shared.dateInput.day}`}
          className="w-full"
          value={dateValues.Day ?? ""}
          onChange={handleChange}
          onPaste={handlePaste}
          disabled={disabled}
        />
        <Input
          ref={monthRef}
          id="Month"
          name="Month"
          type="number"
          max={12}
          min={1}
          maxLength={2}
          placeholder={`${t.shared.dateInput.moth}`}
          className="w-full"
          value={dateValues.Month ?? ""}
          onChange={handleChange}
          disabled={disabled}
        />
        <Input
          ref={yearRef}
          id="Year"
          name="Year"
          type="number"
          min={1800}
          maxLength={4}
          placeholder={`${t.shared.dateInput.year}`}
          className="w-full"
          value={dateValues.Year ?? ""}
          onChange={handleChange}
          disabled={disabled}
        />
      </div>
      {checkValidation && (
        <div className="text-sm text-red-500">
          {!isValidDate(
            dateValues.Day || 0,
            dateValues.Month || 0,
            dateValues.Year || 0,
          ) && "date invalide"}
        </div>
      )}
    </div>
  );
}
