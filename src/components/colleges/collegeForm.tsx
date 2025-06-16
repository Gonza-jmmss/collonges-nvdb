"use client";

import { useState } from "react";
import createCollegeCommand from "@/repositories/colleges/commands/createCollegeCommand";
import updateCollegeCommand from "@/repositories/colleges/commands/updateCollegeCommand";
import { CollegeViewModel } from "@/repositories/colleges/collegesViewModel";
import { CollegeSchema } from "@/zodSchemas/collegeSchema";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

type CollegeFormData = z.infer<typeof CollegeSchema>;

export default function CollegeForm({
  collegeData,
  pageIndexParam,
  pageSizeParam,
  action,
  urlParams,
}: {
  collegeData: CollegeViewModel | null;
  pageIndexParam: number;
  pageSizeParam: number;
  action: string | undefined;
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const { toast } = useToast();
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const form = useForm<CollegeViewModel>({
    defaultValues: {
      CollegeId: action !== "create" ? (collegeData?.CollegeId ?? 0) : 0,
      Name: action !== "create" ? (collegeData?.Name ?? null) : null,
      Abbreviation:
        action !== "create" ? (collegeData?.Abbreviation ?? null) : null,
    },
    onSubmit: async ({ value }) => {
      //   console.log("formData", value);
      setIsPending(true);
      action === "create" && createCollege(value);
      action === "edit" && updateCollege(value);
    },
  });

  const createCollege = async (formData: CollegeFormData) => {
    try {
      const response = await createCollegeCommand(formData);

      if (!response) {
        throw new Error(`${t.colleges.notifications.createFailure}`);
      }
      toast({
        title: `${t.colleges.notifications.createSuccess}`,
        description: `${t.colleges.title} : ${response?.Name}`,
      });

      router.push(
        `/students/colleges?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}`,
      );
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.colleges.notifications.createError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const updateCollege = async (formData: CollegeFormData) => {
    try {
      const response = await updateCollegeCommand(formData);

      if (!response) {
        throw new Error(`${t.colleges.notifications.updateFailure}`);
      }
      toast({
        title: `${t.colleges.notifications.updateSuccess}`,
        description: `${t.colleges.title} : ${formData?.Name}`,
      });

      router.push(
        `/students/colleges?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}`,
      );
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.colleges.notifications.updateError}`,
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
      <div className="col-span-2 space-y-1">
        <form.Field
          name="Name"
          children={(field) => (
            <>
              <span>{t.colleges.form.name}</span>
              <Input
                id="Name"
                name="Name"
                placeholder={`${t.colleges.form.name}`}
                className="w-full"
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={action === "view"}
                required
              />
            </>
          )}
        />
      </div>
      <div className="col-span-2 space-y-1">
        <form.Field
          name="Abbreviation"
          children={(field) => (
            <>
              <span>{t.colleges.form.abbreviation}</span>
              <Input
                id="Abbreviation"
                name="Abbreviation"
                placeholder={`${t.colleges.form.abbreviation}`}
                className="w-full"
                value={field.state.value || ""}
                onChange={(e) => field.handleChange(e.target.value)}
                disabled={action === "view"}
                required
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
              onClick={() =>
                router.push(
                  `/students/colleges?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}`,
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
                  `/students/colleges?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}`,
                )
              }
            >
              {t.shared.cancel}
            </Button>
          </div>
        )}
      </div>
      {/* <pre>{JSON.stringify(collegeData, null, 2)}</pre> */}
    </form>
  );
}
