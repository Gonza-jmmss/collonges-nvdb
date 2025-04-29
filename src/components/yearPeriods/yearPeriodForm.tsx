"use client";

import { useState } from "react";
import createYearPeriodCommand from "@/repositories/yearPeriods/commands/createYearPeriodCommand";
import updateYearPeriodCommand from "@/repositories/yearPeriods/commands/updateYearPeriodCommand";
import { yearPeriodsViewModel } from "@/repositories/yearPeriods/yearPeriodsViewModel";
import { ScholarYearsViewModel } from "@/repositories/scholarYears/scholarYearsViewModel";
import { YearPeriodSchema } from "@/zodSchemas/yearPeriodSchema";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/common/combobox";
import ToggleButton from "@/components/common/toggleButton";
import enumToArray from "@/functions/enumToArray";
import { YearPeriodsEnum } from "@/enum/yearPerdios";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

type YearPeriodFormData = z.infer<typeof YearPeriodSchema>;

export default function YearPeriodForm({
  yearPeriodData,
  scholarYears,
  pageIndexParam,
  pageSizeParam,
  action,
  urlParams,
}: {
  yearPeriodData: yearPeriodsViewModel | null;
  scholarYears: ScholarYearsViewModel[];
  pageIndexParam: number;
  pageSizeParam: number;
  action: string | undefined;
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const { toast } = useToast();
  const router = useRouter();
  const updateQuery = useUpdateQuery();

  const [isPending, setIsPending] = useState(false);

  const isEnabledParam =
    urlParams?.isEnabled === undefined ? true : urlParams.isEnabled === "true";

  const form = useForm<YearPeriodFormData>({
    defaultValues: {
      YearPeriodId:
        action !== "create" ? (yearPeriodData?.YearPeriodId ?? 0) : 0,
      Name: action !== "create" ? (yearPeriodData?.Name ?? "") : "",
      PeriodType:
        action !== "create" ? (yearPeriodData?.PeriodType ?? null) : null,
      ScholarYearId:
        action !== "create" ? (yearPeriodData?.ScholarYearId ?? null) : null,
      IsEnabled:
        action !== "create" ? (yearPeriodData?.IsEnabled ?? true) : true,
    },
    onSubmit: async ({ value }) => {
      //   console.log("formData", value);
      action === "create" && createYearPeriod(value);
      action === "edit" && updateYearPeriod(value);
    },
  });

  const createYearPeriod = async (formData: YearPeriodFormData) => {
    try {
      const response = await createYearPeriodCommand(formData);

      if (!response) {
        throw new Error(`${t.yearPeriods.notifications.createFailure}`);
      }
      toast({
        title: `${t.yearPeriods.notifications.createSuccess}`,
        description: `${t.yearPeriods.title} : ${response?.Name}`,
      });

      router.push(
        `/students/yearPeriods?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&isEnabled=${isEnabledParam}`,
      );
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.yearPeriods.notifications.createError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const updateYearPeriod = async (formData: YearPeriodFormData) => {
    try {
      const response = await updateYearPeriodCommand(formData);

      if (!response) {
        throw new Error(`${t.yearPeriods.notifications.updateFailure}`);
      }
      toast({
        title: `${t.yearPeriods.notifications.updateSuccess}`,
        description: `${t.yearPeriods.title} : ${formData?.Name}`,
      });

      router.push(
        `/students/yearPeriods?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&isEnabled=${isEnabledParam}`,
      );
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.yearPeriods.notifications.updateError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const handleUrlParameterChange = (key: string, value: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set(key, value);

    // Update URL without replacing current parameters
    const newUrl = `${window.location.pathname}?${currentParams.toString()}`;

    window.history.pushState({}, "", newUrl);

    // If you need to update some state as well
    updateQuery(Object.fromEntries(currentParams));
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="mt-3 grid grid-cols-1 gap-5"
    >
      <div className="col-span-1 space-y-1">
        <form.Field
          name="Name"
          children={(field) => (
            <>
              <span>{t.yearPeriods.form.name}</span>
              <Input
                id="Name"
                name="Name"
                placeholder={`${t.yearPeriods.form.name}`}
                className="w-full"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={action === "view"}
                required
              />
            </>
          )}
        />
      </div>
      <div className="col-span-1 space-y-1">
        <form.Field
          name="IsEnabled"
          children={(field) => (
            <>
              <span>{t.yearPeriods.form.isEnabled}</span>
              <ToggleButton
                options={[
                  { key: false, value: t.shared.no },
                  { key: true, value: t.shared.yes },
                ]}
                setItemSelected={(x: { key: boolean; value: string }) => {
                  field.handleChange(x && x.key);
                }}
                itemSelected={field.state.value}
                disabled={action === "view"}
              />
            </>
          )}
        />
      </div>
      <div className="col-span-1 space-y-1">
        <form.Field
          name="PeriodType"
          validators={{
            onSubmitAsync: (value) => {
              if (value === null || value === undefined) {
                return t.yearPeriods.validations.periodTypeValidation;
              }
              return z.number().min(0).safeParse(value.value).success
                ? undefined
                : t.yearPeriods.validations.periodTypeValidation;
            },
          }}
          children={(field) => (
            <>
              <span>{t.yearPeriods.form.periodType}</span>
              <Combobox
                options={enumToArray(YearPeriodsEnum)}
                textAttribute="value"
                valueAttribute="key"
                placeholder={t.yearPeriods.form.periodType}
                itemSelected={enumToArray(YearPeriodsEnum).find(
                  (x) => x.key === field.state.value,
                )}
                setItemSelected={(x: { key: number }) => {
                  field.handleChange(x && x.key);
                }}
                disabled={action === "view"}
                notClearable
              />
              <div className="text-xs text-red-500">
                {field.state.meta.errors
                  ? field.state.meta.errors.join(", ")
                  : null}
              </div>
            </>
          )}
        />
      </div>
      <div className="col-span-1 space-y-1">
        <form.Field
          name="ScholarYearId"
          validators={{
            onSubmitAsync: (value) => {
              if (value === null || value === undefined) {
                return t.yearPeriods.validations.scholarYearValidation;
              }
              return z.number().min(0).safeParse(value.value).success
                ? undefined
                : t.yearPeriods.validations.scholarYearValidation;
            },
          }}
          children={(field) => (
            <>
              <span>{t.yearPeriods.form.scholarYearId}</span>
              <Combobox
                options={scholarYears}
                textAttribute="Name"
                valueAttribute="ScholarYearId"
                placeholder={t.yearPeriods.form.scholarYearId}
                itemSelected={scholarYears.find(
                  (x) => x.ScholarYearId === field.state.value,
                )}
                setItemSelected={(x: { ScholarYearId: number }) => {
                  field.handleChange(x && x.ScholarYearId);
                }}
                disabled={action === "view"}
                showSearch
              />
              <div className="text-xs text-red-500">
                {field.state.meta.errors
                  ? field.state.meta.errors.join(", ")
                  : null}
              </div>
            </>
          )}
        />
      </div>
      <div className="col-span-1">
        {action !== "view" ? (
          <div className="flex justify-center space-x-3">
            <Button
              type="button"
              variant={"secondary"}
              className="w-[30%]"
              onClick={() =>
                router.push(
                  `/students/yearPeriods?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&isEnabled=${isEnabledParam}`,
                )
              }
            >
              {t.shared.cancel}
            </Button>
            <Button
              type="submit"
              variant={"default"}
              className="w-[30%]"
              disabled={isPending}
            >
              {t.shared.save}
            </Button>
          </div>
        ) : (
          <div className="flex justify-center space-x-3">
            <Button
              variant={"secondary"}
              className="w-[30%]"
              onClick={() =>
                router.push(
                  `/students/yearPeriods?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&isEnabled=${isEnabledParam}`,
                )
              }
            >
              {t.shared.cancel}
            </Button>
          </div>
        )}
      </div>
      {/* <pre>{JSON.stringify(YearPeriodData, null, 2)}</pre> */}
    </form>
  );
}
