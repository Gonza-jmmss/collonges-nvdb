"use client";

import { useState } from "react";
import createScholarPeriodCommand from "@/repositories/scholarPeriods/commands/createScholarPeriodCommand";
import updateScholarPeriodCommand from "@/repositories/scholarPeriods/commands/updateScholarPeriodCommand";
import { ScholarYearsViewModel } from "@/repositories/scholarYears/scholarYearsViewModel";
import { ScholarPeriodsViewModel } from "@/repositories/scholarPeriods/scholarPeriodsViewModel";
import { ScholarPeriodSchema } from "@/zodSchemas/scholarPeriodSchema";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Combobox from "@/components/common/combobox";
import DateInput from "@/components/common/dateInput";
import ToggleButton from "@/components/common/toggleButton";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

type ScholarPeriodFormData = z.infer<typeof ScholarPeriodSchema>;

export default function ScholarPeriodForm({
  scholarPeriodData,
  scholarYears,
  action,
}: {
  scholarPeriodData: ScholarPeriodsViewModel | null;
  scholarYears: ScholarYearsViewModel[];
  action: string | undefined;
}) {
  const t = frFR;
  const { toast } = useToast();
  const router = useRouter();
  const updateQuery = useUpdateQuery();

  const [isPending, setIsPending] = useState(false);

  const form = useForm<ScholarPeriodFormData>({
    defaultValues: {
      ScholarPeriodId:
        action !== "create"
          ? (scholarPeriodData?.ScholarPeriodId ?? null)
          : null,
      Name: action !== "create" ? (scholarPeriodData?.Name ?? "") : "",
      Number: action !== "create" ? (scholarPeriodData?.Number ?? 0) : 0,
      FromDate:
        action !== "create" ? (scholarPeriodData?.FromDate ?? null) : null,
      ToDate: action !== "create" ? (scholarPeriodData?.ToDate ?? null) : null,
      IsActive:
        action !== "create" ? (scholarPeriodData?.IsActive ?? true) : true,
      ScholarYearId:
        action !== "create"
          ? (scholarPeriodData?.ScholarYearId ?? scholarYears[0].ScholarYearId)
          : scholarYears[0].ScholarYearId,
    },
    onSubmit: async ({ value }) => {
      // console.log("formData", value);
      action === "create" && createScholarPeriod(value);
      action === "edit" && updateScholarPeriod(value);
    },
  });

  const createScholarPeriod = async (formData: ScholarPeriodFormData) => {
    try {
      const response = await createScholarPeriodCommand(formData);

      if (!response) {
        throw new Error(`${t.scholarPeriods.notifications.createFailure}`);
      }
      toast({
        title: `${t.scholarPeriods.notifications.createSuccess}`,
        description: `${t.scholarPeriods.title} : ${response?.Name}`,
      });

      router.push("/courses/scholarPeriods");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.scholarPeriods.notifications.createError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const updateScholarPeriod = async (formData: ScholarPeriodFormData) => {
    try {
      const response = await updateScholarPeriodCommand(formData);

      if (!response) {
        throw new Error(`${t.scholarPeriods.notifications.updateFailure}`);
      }
      toast({
        title: `${t.scholarPeriods.notifications.updateSuccess}`,
        description: `${t.scholarPeriods.title} : ${scholarPeriodData?.Name}`,
      });

      router.push("/courses/scholarPeriods");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.scholarPeriods.notifications.updateError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2"
    >
      <div className="col-span-1 space-y-1">
        <form.Field
          name="Name"
          children={(field) => (
            <>
              <span>{t.scholarPeriods.form.name}</span>
              <Input
                id="Name"
                name="Name"
                placeholder={`${t.scholarPeriods.form.name}`}
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
          name="Number"
          children={(field) => (
            <>
              <span>{t.scholarPeriods.form.number}</span>
              <Input
                id="Number"
                name="Number"
                type="number"
                placeholder={`${t.scholarPeriods.form.number}`}
                className="w-full"
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(parseInt(e.target.value))}
                disabled={action === "view"}
                required
              />
            </>
          )}
        />
      </div>
      <div className="col-span-1 space-y-1">
        <form.Field
          name="FromDate"
          // validators={{
          //   onSubmitAsync: (value) => {
          //     if (value === null || value === undefined) {
          //       return t.students.validations.bithDateValidation;
          //     }
          //     return z.date().safeParse(value.value).success
          //       ? undefined
          //       : t.students.validations.bithDateValidation;
          //   },
          // }}
          children={(field) => (
            <>
              <span>{t.scholarPeriods.form.fromDate}</span>
              <DateInput
                dateForm={field.state.value}
                setItemSelected={(x: Date) => {
                  field.handleChange(x);
                }}
                disabled={action === "view"}
              />
              {/* <div className="text-xs text-red-500">
                {field.state.meta.errors
                  ? field.state.meta.errors.join(", ")
                  : null}
              </div> */}
            </>
          )}
        />
      </div>
      <div className="col-span-1 space-y-1">
        <form.Field
          name="ToDate"
          // validators={{
          //   onSubmitAsync: (value) => {
          //     if (value === null || value === undefined) {
          //       return t.students.validations.bithDateValidation;
          //     }
          //     return z.date().safeParse(value.value).success
          //       ? undefined
          //       : t.students.validations.bithDateValidation;
          //   },
          // }}
          children={(field) => (
            <>
              <span>{t.scholarPeriods.form.toDate}</span>
              <DateInput
                dateForm={field.state.value}
                setItemSelected={(x: Date) => {
                  field.handleChange(x);
                }}
                disabled={action === "view"}
              />
              {/* <div className="text-xs text-red-500">
                {field.state.meta.errors
                  ? field.state.meta.errors.join(", ")
                  : null}
              </div> */}
            </>
          )}
        />
      </div>
      <div className="col-span-1 space-y-1">
        <form.Field
          name="IsActive"
          children={(field) => (
            <>
              <span>{t.scholarPeriods.form.isActive}</span>
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
          name="ScholarYearId"
          children={(field) => (
            <>
              <span>{t.scholarPeriods.form.scholarYearId}</span>
              <Combobox
                options={scholarYears}
                textAttribute="Name"
                valueAttribute="ScholarYearId"
                placeholder={t.scholarPeriods.form.scholarYearId}
                itemSelected={scholarYears.find(
                  (x) => x.ScholarYearId === field.state.value,
                )}
                setItemSelected={(x: { ScholarYearId: number }) => {
                  field.handleChange(x && x.ScholarYearId);
                }}
                disabled={action === "view"}
                showSearch
              />
            </>
          )}
        />
      </div>
      <div className="col-span-1 md:col-span-2">
        {action !== "view" ? (
          <div className="flex justify-center space-x-3">
            <Button
              type="button"
              variant={"secondary"}
              className="w-[30%]"
              onClick={() => router.push("/courses/scholarPeriods")}
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
              onClick={() => router.back()}
            >
              {t.shared.cancel}
            </Button>
          </div>
        )}
      </div>
      {/* <pre>{JSON.stringify(scholarPeriodsData, null, 2)}</pre> */}
    </form>
  );
}
