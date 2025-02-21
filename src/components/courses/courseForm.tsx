"use client";

import { useState } from "react";
import createCourseCommand from "@/repositories/courses/commands/createCourseCommand";
import updateCourseCommand from "@/repositories/courses/commands/updateCourseCommand";
import { CourseViewModel } from "@/repositories/courses/coursesViewModel";
import { CourseSchema } from "@/zodSchemas/courseSchema";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/common/combobox";
import ToggleButton from "@/components/common/toggleButton";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

type CoursFormData = z.infer<typeof CourseSchema>;

export default function CourseForm({
  courseData,
  action,
}: {
  courseData: CourseViewModel | null;
  action: string;
}) {
  const t = frFR;
  const { toast } = useToast();
  const router = useRouter();

  const [isPending, setIsPending] = useState(false);

  const coursePeriods = [{ CoursePeriodId: 1, Name: "Quarter" }];
  const CourseTypes = [{ CourseTypeId: 1, Name: "IFLE" }];

  const form = useForm<CoursFormData>({
    defaultValues: {
      CourseId: action !== "create" ? (courseData?.CourseId ?? null) : null,
      Name: action !== "create" ? (courseData?.Name ?? "") : "",
      EnglishName: action !== "create" ? (courseData?.EnglishName ?? "") : "",
      CourseCode: action !== "create" ? (courseData?.CourseCode ?? null) : null,
      CreditAmount:
        action !== "create" ? (courseData?.CreditAmount ?? null) : null,
      CoursePeriodId:
        action !== "create" ? (courseData?.CoursePeriodId ?? 1) : 1,
      PeriodNumber: action !== "create" ? (courseData?.PeriodNumber ?? 4) : 4,
      CourseTypeId: action !== "create" ? (courseData?.CourseTypeId ?? 1) : 1,
      IsEnabled: action !== "create" ? (courseData?.IsEnabled ?? true) : true,
    },
    onSubmit: async ({ value }) => {
      // console.log("formData", value);
      action === "create" && createCourse(value);
      action === "edit" && updateCourse(value);
    },
  });

  const createCourse = async (formData: CoursFormData) => {
    try {
      const response = await createCourseCommand(formData);

      if (!response) {
        throw new Error(`${t.courses.notifications.createFailure}`);
      }
      toast({
        title: `${t.courses.notifications.createSuccess}`,
        description: `${t.courses.title} : ${response.Name}`,
      });

      router.push("/courses/courses");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.courses.notifications.createError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const updateCourse = async (formData: CoursFormData) => {
    try {
      const response = await updateCourseCommand(formData);

      if (!response) {
        throw new Error(`${t.courses.notifications.updateFailure}`);
      }
      toast({
        title: `${t.courses.notifications.updateSuccess}`,
        description: `${t.courses.title} : ${response.Name}`,
      });

      router.push("/courses/courses");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.courses.notifications.updateError}`,
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
      <div className="space-y-1">
        <form.Field
          name="Name"
          children={(field) => (
            <>
              <span>{t.courses.form.name}</span>
              <Input
                id="Name"
                name="Name"
                placeholder={`${t.courses.form.name}`}
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
      <div className="space-y-1">
        <form.Field
          name="EnglishName"
          children={(field) => (
            <>
              <span>{t.courses.form.englishName}</span>
              <Input
                id="EnglishName"
                name="EnglishName"
                placeholder={`${t.courses.form.englishName}`}
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
      <div className="space-y-1">
        <form.Field
          name="CourseCode"
          children={(field) => (
            <>
              <span>{t.courses.form.courseCode}</span>
              <Input
                id="CourseCode"
                name="CourseCode"
                placeholder={`${t.courses.form.courseCode}`}
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
      <div className="space-y-1">
        <form.Field
          name="CreditAmount"
          children={(field) => (
            <>
              <span>{t.courses.form.creditAmount}</span>
              <Input
                id="CreditAmount"
                name="CreditAmount"
                type="number"
                placeholder={`${t.courses.form.creditAmount}`}
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
      <div className="space-y-1">
        <form.Field
          name="CoursePeriodId"
          children={(field) => (
            <>
              <span>{t.courses.form.coursePeriodId}</span>
              <Combobox
                options={coursePeriods}
                textAttribute="Name"
                valueAttribute="CoursePeriodId"
                placeholder={t.courses.form.coursePeriodId}
                itemSelected={coursePeriods.find(
                  (x) => x.CoursePeriodId === field.state.value,
                )}
                setItemSelected={(x: { CoursePeriodId: number }) => {
                  field.handleChange(x && x.CoursePeriodId);
                }}
                disabled={true}
                showSearch
              />
            </>
          )}
        />
      </div>
      <div className="space-y-1">
        <form.Field
          name="PeriodNumber"
          children={(field) => (
            <>
              <span>{t.courses.form.periodNumber}</span>
              <Input
                id="PeriodNumber"
                name="PeriodNumber"
                type="number"
                placeholder={`${t.courses.form.periodNumber}`}
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
      <div className="space-y-1">
        <form.Field
          name="CourseTypeId"
          children={(field) => (
            <>
              <span>{t.courses.form.courseTypeId}</span>
              <Combobox
                options={CourseTypes}
                textAttribute="Name"
                valueAttribute="CourseTypeId"
                placeholder={t.courses.form.courseTypeId}
                itemSelected={CourseTypes.find(
                  (x) => x.CourseTypeId === field.state.value,
                )}
                setItemSelected={(x: { CourseTypeId: number }) => {
                  field.handleChange(x && x.CourseTypeId);
                }}
                disabled={true}
                showSearch
              />
            </>
          )}
        />
      </div>
      <div className="space-y-1">
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
      <div className="col-span-1 md:col-span-2">
        {action !== "view" ? (
          <div className="flex justify-center space-x-3">
            <Button
              type="button"
              variant={"secondary"}
              className="w-[30%]"
              onClick={() => router.back()}
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
    </form>
  );
}
