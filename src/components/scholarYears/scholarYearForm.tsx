"use client";

import { useState } from "react";
import createScholarYearCommand from "@/repositories/scholarYears/commands/createScholarYearCommand";
import updateScholarYearCommand from "@/repositories/scholarYears/commands/updateScholarYearCommand";
import { ScholarYearsViewModel } from "@/repositories/scholarYears/scholarYearsViewModel";
import { ScholarYearSchema } from "@/zodSchemas/scholarYearSchema";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import DateInput from "@/components/common/dateInput";
import ToggleButton from "@/components/common/toggleButton";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

type ScholarYearFormData = z.infer<typeof ScholarYearSchema>;

export default function ScholarYearForm({
  scholarYearData,
  action,
}: {
  scholarYearData: ScholarYearsViewModel | null;
  action: string | undefined;
}) {
  const t = frFR;
  const { toast } = useToast();
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const form = useForm<ScholarYearFormData>({
    defaultValues: {
      ScholarYearId:
        action !== "create" ? (scholarYearData?.ScholarYearId ?? null) : null,
      Name: action !== "create" ? (scholarYearData?.Name ?? "") : "",
      FromDate:
        action !== "create" ? (scholarYearData?.FromDate ?? null) : null,
      ToDate: action !== "create" ? (scholarYearData?.ToDate ?? null) : null,
      IsActive:
        action !== "create" ? (scholarYearData?.IsActive ?? true) : true,
    },
    onSubmit: async ({ value }) => {
      //   console.log("formData", value);
      action === "create" && createScholarYear(value);
      action === "edit" && updateScholarYear(value);
    },
  });

  const createScholarYear = async (formData: ScholarYearFormData) => {
    try {
      const response = await createScholarYearCommand(formData);

      if (!response) {
        throw new Error(`${t.scholarYears.notifications.createFailure}`);
      }
      toast({
        title: `${t.scholarYears.notifications.createSuccess}`,
        description: `${t.scholarYears.title} : ${response?.Name}`,
      });

      router.push("/courses/scholarYears");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.scholarYears.notifications.createError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const updateScholarYear = async (formData: ScholarYearFormData) => {
    try {
      const response = await updateScholarYearCommand(formData);

      if (!response) {
        throw new Error(`${t.scholarYears.notifications.updateFailure}`);
      }
      toast({
        title: `${t.scholarYears.notifications.updateSuccess}`,
        description: `${t.scholarYears.title} : ${response?.Name}`,
      });

      router.push("/courses/scholarYears");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.scholarYears.notifications.updateError}`,
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
              <span>{t.scholarYears.form.name}</span>
              <Input
                id="Name"
                name="Name"
                placeholder={`${t.scholarYears.form.name}`}
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
          name="IsActive"
          children={(field) => (
            <>
              <span>{t.scholarYears.form.isActive}</span>
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
              <span>{t.scholarYears.form.fromDate}</span>
              <DateInput
                dateForm={field.state.value}
                setItemSelected={(x: Date) => {
                  field.handleChange(x);
                }}
                disabled={action === "view"}
                noMaxYearValidation
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
              <span>{t.scholarYears.form.toDate}</span>
              <DateInput
                dateForm={field.state.value}
                setItemSelected={(x: Date) => {
                  field.handleChange(x);
                }}
                disabled={action === "view"}
                noMaxYearValidation
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
      <div className="col-span-1 md:col-span-2">
        {action !== "view" ? (
          <div className="flex justify-center space-x-3">
            <Button
              type="button"
              variant={"secondary"}
              className="w-[30%]"
              onClick={() => router.push("/courses/scholarYears")}
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
      {/* <pre>{JSON.stringify(scholarYearsData, null, 2)}</pre> */}
    </form>
  );
}
