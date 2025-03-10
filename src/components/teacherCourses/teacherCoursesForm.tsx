"use client";

import { useState } from "react";
import updateTeacherCourseCommand from "@/repositories/teacherCourses/commands/updateTeacherCourses";
import { TeacherCoursesByIdViewModel } from "@/repositories/teacherCourses/teacherCoursesViewModel";
import { CourseViewModel } from "@/repositories/courses/coursesViewModel";
import { TeacherCourseSchema } from "@/zodSchemas/teacherCoursesSchema";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/common/combobox";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import enumToArray from "@/functions/enumToArray";
import { PeriodEnum } from "@/enum/periodEnum";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

type TeacherCourseFormData = z.infer<typeof TeacherCourseSchema>;

export default function TeacherCoursesForm({
  teacherCoursesData,
  courses,
  allCourses,
  action,
  urlParams,
}: {
  teacherCoursesData: TeacherCoursesByIdViewModel;
  courses: CourseViewModel[];
  allCourses: CourseViewModel[];
  action: string | undefined;
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const { toast } = useToast();
  const router = useRouter();
  const updateQuery = useUpdateQuery();

  const [isPending, setIsPending] = useState(false);

  const [periodSelected, setPeriodSelected] = useState(
    typeof urlParams?.period === "string" ? parseInt(urlParams?.period) : 4,
  );

  const form = useForm<TeacherCourseFormData>({
    defaultValues: {
      UserId: action !== "create" ? (teacherCoursesData?.UserId ?? 0) : 0,
      TeacherCourses:
        action !== "create"
          ? (teacherCoursesData?.TeacherCourses?.map((teacherCourses) => ({
              CourseId: teacherCourses.CourseId,
            })) ?? null)
          : null,
    },
    onSubmit: async ({ value }) => {
      console.log("formData", value);
      action === "edit" && updateLevel(value);
    },
  });

  const updateLevel = async (formData: TeacherCourseFormData) => {
    try {
      const response = await updateTeacherCourseCommand(formData);

      if (!response) {
        throw new Error(`${t.teacherCourses.notifications.updateFailure}`);
      }
      toast({
        title: `${t.teacherCourses.notifications.updateSuccess}`,
        description: `${t.teacherCourses.title} : ${formData?.UserId}`,
      });

      router.push("/courses/teacherCourses");
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.teacherCourses.notifications.updateError}`,
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

    // Use router.push or history.pushState depending on your navigation setup
    // router.push(newUrl);
    // or
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
      className="mt-3 grid grid-cols-2 gap-5"
    >
      <div className="col-span-2 space-y-1">
        <form.Field
          name="TeacherCourses"
          mode="array"
          children={(field) => (
            <div className="flex flex-col space-y-5">
              <div className="grid grid-cols-6">
                <span className="col-span-6">
                  {t.teacherCourses.form.addCourse}
                </span>
                <span className="col-span-2 mt-3 md:col-span-1">
                  {t.teacherCourses.form.coursePeriod}
                </span>
                <div className="col-span-4 mt-2 md:col-span-5">
                  <Combobox
                    options={enumToArray(PeriodEnum)}
                    textAttribute="value"
                    valueAttribute="key"
                    placeholder={t.courses.form.periodNumber}
                    itemSelected={enumToArray(PeriodEnum).find(
                      (x) => x.key === periodSelected,
                    )}
                    setItemSelected={(x: { key: number }) => {
                      setPeriodSelected(x && x.key);
                      handleUrlParameterChange("period", `${x.key}`);
                    }}
                  />
                </div>
                <span className="col-span-2 mt-3 md:col-span-1">
                  {t.teacherCourses.form.teacherCourses}
                </span>
                <div className="col-span-4 mt-2 md:col-span-5">
                  <Combobox
                    options={courses}
                    textAttribute={["CourseCode", "Name"]}
                    valueAttribute="CourseId"
                    placeholder={t.teacherCourses.form.teacherCourses}
                    setItemSelected={(x: { CourseId: number }) => {
                      if (
                        !field.state.value
                          ?.map((v) => v.CourseId)
                          .includes(x.CourseId)
                      )
                        field.pushValue({
                          CourseId: x && x.CourseId,
                        });
                    }}
                    disabled={action === "view"}
                    showSearch
                    notClearable
                  />
                </div>
              </div>
              <div className="space-y-3 rounded-md border bg-muted p-2">
                <div className="grid grid-cols-12">
                  <div className="col-span-7 text-sm font-semibold">
                    {t.teacherCourses.expanded.name}
                  </div>
                  <div className="col-span-4 text-sm font-semibold">
                    {t.teacherCourses.expanded.courseCode}
                  </div>
                </div>
                {field.state.value?.map((studentCourse, index) => (
                  <div
                    key={index}
                    className="col-span-1 rounded-md border border-foreground/30 p-2 md:col-span-2"
                  >
                    <div className="grid grid-cols-12">
                      <div className="col-span-7 text-sm">
                        {
                          allCourses.find(
                            (x) => x.CourseId === studentCourse.CourseId,
                          )?.Name
                        }
                      </div>
                      <div className="col-span-4 text-sm">
                        {` ${
                          allCourses.find(
                            (x) => x.CourseId === studentCourse.CourseId,
                          )?.CourseCode
                        } `}
                      </div>
                      <Icon
                        name={
                          isValidIconName("MdClose")
                            ? "MdClose"
                            : "MdOutlineNotInterested"
                        }
                        className="col-span-1 cursor-pointer place-self-center text-xl hover:text-primary"
                        onClick={() => field.removeValue(index)}
                      />
                    </div>
                  </div>
                ))}
                {/* <pre>{JSON.stringify(field.state.value, null, 2)}</pre> */}
              </div>
            </div>
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
              onClick={() => router.push("/courses/teacherCourses")}
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
      {/* <pre>{JSON.stringify(teacherCoursesData, null, 2)}</pre> */}
    </form>
  );
}
