"use client";

import { useState } from "react";
import createGradeCoefficientCommand from "@/repositories/gradeCoefficients/commands/createGradeCoefficientCommand";
import updateGradeCoefficientCommand from "@/repositories/gradeCoefficients/commands/updateGradeCoefficientCommand";
import { GradeCoefficientsViewModel } from "@/repositories/gradeCoefficients/gradeCoefficientsViewModel";
import { GradeCoefficientSchema } from "@/zodSchemas/gradeCoefficientSchema";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ToggleButton from "@/components/common/toggleButton";
import Combobox from "@/components/common/combobox";
import enumToArray from "@/functions/enumToArray";
import { CoefficientPeriodEnum } from "@/enum/coefficientPeriodEnum";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

type GradeCoefficientFormData = z.infer<typeof GradeCoefficientSchema>;

export default function GradeCoefficientForm({
  gradeCoefficientData,
  pageIndexParam,
  pageSizeParam,
  action,
  urlParams,
}: {
  gradeCoefficientData: GradeCoefficientsViewModel | null;
  pageIndexParam: number;
  pageSizeParam: number;
  action: string | undefined;
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const { toast } = useToast();
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const isEnabledParam =
    urlParams?.isEnabled === undefined ? true : urlParams.isEnabled === "true";

  //   GradeCoefficientId: number | null;
  //     Name: string;
  //     Coefficient: number;
  //     IsEnabled: boolean;

  const form = useForm<GradeCoefficientFormData>({
    defaultValues: {
      GradeCoefficientId:
        action !== "create"
          ? (gradeCoefficientData?.GradeCoefficientId ?? null)
          : null,
      Name: action !== "create" ? (gradeCoefficientData?.Name ?? "") : "",
      Coefficient:
        action !== "create"
          ? (gradeCoefficientData?.CoefficientNumber ?? 0)
          : 0,
      IsEnabled:
        action !== "create" ? (gradeCoefficientData?.IsEnabled ?? true) : true,
      CoefficientPeriod:
        action !== "create"
          ? (gradeCoefficientData?.CoefficientPeriod ?? 0)
          : 0,
    },
    onSubmit: async ({ value }) => {
      // console.log("formData", value);
      setIsPending(true);
      action === "create" && createGradeCoefficient(value);
      action === "edit" && updateGradeCoefficient(value);
    },
  });

  const createGradeCoefficient = async (formData: GradeCoefficientFormData) => {
    try {
      const response = await createGradeCoefficientCommand(formData);

      if (!response) {
        throw new Error(`${t.gradeCoefficients.notifications.createFailure}`);
      }
      toast({
        title: `${t.gradeCoefficients.notifications.createSuccess}`,
        description: `${t.gradeCoefficients.title} : ${response.Name}`,
      });

      router.push(
        `/courses/gradeCoefficients?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&isEnabled=${isEnabledParam}`,
      );
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.gradeCoefficients.notifications.createError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const updateGradeCoefficient = async (formData: GradeCoefficientFormData) => {
    try {
      const response = await updateGradeCoefficientCommand(formData);

      if (!response) {
        throw new Error(`${t.gradeCoefficients.notifications.updateFailure}`);
      }
      toast({
        title: `${t.gradeCoefficients.notifications.updateSuccess}`,
        description: `${t.gradeCoefficients.title} : ${response.Name}`,
      });

      router.push(
        `/courses/gradeCoefficients?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&isEnabled=${isEnabledParam}`,
      );
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.gradeCoefficients.notifications.updateError}`,
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
      className="mt-3 grid grid-cols-1 gap-5"
    >
      <div className="col-span-1 space-y-1">
        <form.Field
          name="Name"
          children={(field) => (
            <>
              <span>{t.gradeCoefficients.form.name}</span>
              <Input
                id="Name"
                name="Name"
                placeholder={`${t.gradeCoefficients.form.name}`}
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
          name={`CoefficientPeriod`}
          validators={{
            onSubmitAsync: (value) => {
              if (value === null || value === undefined) {
                return t.gradeCoefficients.validations
                  .coefficientPeriodValidation;
              }
              return z.number().min(0).safeParse(value.value).success
                ? undefined
                : t.gradeCoefficients.validations.coefficientPeriodValidation;
            },
          }}
          children={(field) => (
            <>
              <span>{t.gradeCoefficients.form.coefficientPeriod}</span>
              <div className="flex flex-col space-y-1">
                <Combobox
                  options={enumToArray(CoefficientPeriodEnum)}
                  textAttribute="value"
                  valueAttribute="key"
                  placeholder={" "}
                  itemSelected={enumToArray(CoefficientPeriodEnum).find(
                    (x) => x.key === field.state.value,
                  )}
                  setItemSelected={(x: { key: number }) =>
                    field.handleChange(x && x.key)
                  }
                  notClearable
                  disabled={action === "view"}
                />
                <div className="text-xs text-red-500">
                  {field.state.meta.errors
                    ? field.state.meta.errors.join(", ")
                    : null}
                </div>
              </div>
            </>
          )}
        />
      </div>
      <div className="col-span-1 space-y-1">
        <form.Field
          name="Coefficient"
          children={(field) => (
            <>
              <span>{t.gradeCoefficients.form.coefficient}</span>
              <Input
                id="Coefficient"
                name="Coefficient"
                type="number"
                placeholder={`${t.gradeCoefficients.form.coefficient}`}
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
          name="IsEnabled"
          children={(field) => (
            <>
              <span>{t.students.form.isEnabled}</span>
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
      <div className="col-span-1">
        {action !== "view" ? (
          <div className="flex justify-center space-x-3">
            <Button
              type="button"
              variant={"secondary"}
              className="w-[30%]"
              onClick={() =>
                router.push(
                  `/courses/gradeCoefficients?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&isEnabled=${isEnabledParam}`,
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
                  `/courses/gradeCoefficients?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&isEnabled=${isEnabledParam}`,
                )
              }
            >
              {t.shared.cancel}
            </Button>
          </div>
        )}
      </div>
    </form>
  );
}
