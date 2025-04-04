"use client";

import { useState, useEffect } from "react";
import createStudentCourseCommand from "@/repositories/studentCourses/commands/createStudentCourseCommands";
import updateStudentCourseCommand from "@/repositories/studentCourses/commands/updateStudentCoursesCommands";
import {
  StudentsWithNoCoursesViewModel,
  StudentCoursesByStudentIdViewModel,
} from "@/repositories/studentCourses/studentCoursesViewModel";
import { CourseViewModel } from "@/repositories/courses/coursesViewModel";
import { ScholarPeriodsViewModel } from "@/repositories/scholarPeriods/scholarPeriodsViewModel";
import { LevelsTableViewModel } from "@/repositories/levels/levelsViewModel";
import { StudentCourseSchema } from "@/zodSchemas/studentCourses";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/common/combobox";
import ToggleButton from "@/components/common/toggleButton";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import enumToArray from "@/functions/enumToArray";
import { PeriodEnum } from "@/enum/periodEnum";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

type StudentCourseFormData = z.infer<typeof StudentCourseSchema>;

export default function StudentCourseForm({
  studentCoursesData,
  studentsWithNoCourses,
  courses,
  allCourses,
  scholarPeriods,
  scholarLevels,
  action,
  urlParams,
}: {
  studentCoursesData: StudentCoursesByStudentIdViewModel;
  studentsWithNoCourses: StudentsWithNoCoursesViewModel[];
  courses: CourseViewModel[];
  allCourses: CourseViewModel[];
  scholarPeriods: ScholarPeriodsViewModel[];
  scholarLevels: LevelsTableViewModel[];
  action: string | undefined;
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const { toast } = useToast();
  const router = useRouter();
  const updateQuery = useUpdateQuery();

  const [isPending, setIsPending] = useState(false);

  const [isLevelCourses, setIsLevelCourses] = useState(true);

  const [periodSelected, setPeriodSelected] = useState(
    typeof urlParams?.period === "string" ? parseInt(urlParams?.period) : 4,
  );
  const scholarPeriodIdParam =
    parseInt(urlParams?.scholarPeriodId as string) || 0;

  const form = useForm<StudentCourseFormData>({
    defaultValues: {
      StudentId: action !== "create" ? (studentCoursesData?.StudentId ?? 0) : 0,
      ScholarPeriodId:
        action !== "create"
          ? (studentCoursesData?.StudentCourses[0]?.ScholarPeriodId ??
            (scholarPeriods.find(
              (x) => x.ScholarPeriodId == scholarPeriodIdParam,
            )?.ScholarPeriodId ||
              scholarPeriods[0].ScholarPeriodId))
          : scholarPeriods.find(
              (x) => x.ScholarPeriodId == scholarPeriodIdParam,
            )?.ScholarPeriodId || scholarPeriods[0].ScholarPeriodId,
      StudentCourses:
        action !== "create"
          ? (studentCoursesData?.StudentCourses?.map((studentCourse) => ({
              CourseId: studentCourse.CourseId,
            })) ?? null)
          : null,
    },
    onSubmit: async ({ value }) => {
      // console.log("formData", value);
      action === "create" && createStudentCourse(value);
      action === "edit" && updateStudentCourse(value);
    },
  });

  const createStudentCourse = async (formData: StudentCourseFormData) => {
    try {
      const response = await createStudentCourseCommand(formData);

      if (!response) {
        throw new Error(`${t.studentCourses.notifications.createFailure}`);
      }
      toast({
        title: `${t.studentCourses.notifications.createSuccess}`,
        description: `${t.studentCourses.title} : ${studentCoursesData?.AlternativeName}`,
      });

      router.push(
        `/courses/studentCourses?scholarPeriodId=${scholarPeriodIdParam}`,
      );
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.studentCourses.notifications.createError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const updateStudentCourse = async (formData: StudentCourseFormData) => {
    try {
      const response = await updateStudentCourseCommand(formData);

      if (!response) {
        throw new Error(`${t.studentCourses.notifications.updateFailure}`);
      }
      toast({
        title: `${t.studentCourses.notifications.updateSuccess}`,
        description: `${t.studentCourses.title} : ${studentCoursesData?.AlternativeName}`,
      });

      router.push(
        `/courses/studentCourses?scholarPeriodId=${scholarPeriodIdParam}`,
      );
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.studentCourses.notifications.updateError}`,
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

  useEffect(() => {
    if (studentCoursesData?.StudentCourses && action !== "create") {
      // Map the existing student courses to the format expected by the form
      const mappedCourses = studentCoursesData.StudentCourses.map(
        (studentCourse) => ({
          CourseId: studentCourse.CourseId,
        }),
      );

      // Set the StudentCourses field value
      form.setFieldValue("StudentCourses", mappedCourses);
    }
  }, [studentCoursesData?.StudentCourses, action, form.setFieldValue]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
      className="mt-3 grid grid-cols-1 gap-5"
    >
      {/* <pre>{JSON.stringify(scholarPeriodIdParam, null, 2)}</pre> */}
      {action === "create" && (
        <div className="col-span-2 space-y-1">
          <form.Field
            name="StudentId"
            validators={{
              onSubmitAsync: (value) => {
                if (value === null || value === undefined) {
                  return t.studentCourses.validations.studentValidation;
                }
                return z.number().min(1).safeParse(value.value).success
                  ? undefined
                  : t.studentCourses.validations.studentValidation;
              },
            }}
            children={(field) => (
              <>
                <span>{t.studentCourses.form.studentId}</span>
                <Combobox
                  options={studentsWithNoCourses}
                  textAttribute="AlternativeName"
                  valueAttribute="StudentId"
                  placeholder={t.studentCourses.form.studentId}
                  itemSelected={studentsWithNoCourses.find(
                    (x) => x.StudentId === field.state.value,
                  )}
                  setItemSelected={(x: { StudentId: number }) => {
                    field.handleChange(x && x.StudentId);
                  }}
                  disabled={action !== "create"}
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
      )}
      <div className="col-span-2 space-y-1">
        <form.Field
          name="ScholarPeriodId"
          validators={{
            onSubmitAsync: (value) => {
              if (value === null || value === undefined) {
                return t.studentCourses.validations.scholarPeriodValidation;
              }
              return z.number().min(0).safeParse(value.value).success
                ? undefined
                : t.studentCourses.validations.scholarPeriodValidation;
            },
          }}
          children={(field) => (
            <>
              <span>{t.studentCourses.form.scholarPeriodId}</span>
              <Combobox
                options={scholarPeriods}
                textAttribute="Name"
                valueAttribute="ScholarPeriodId"
                placeholder={t.studentCourses.form.scholarPeriodId}
                itemSelected={scholarPeriods.find(
                  (x) => x.ScholarPeriodId === field.state.value,
                )}
                setItemSelected={(x: { ScholarPeriodId: number }) => {
                  field.handleChange(x && x.ScholarPeriodId);
                  handleUrlParameterChange(
                    "scholarPeriodId",
                    `${x.ScholarPeriodId}`,
                  );
                }}
                disabled={action === "view"}
                showSearch
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
      <div className="col-span-2 space-y-1">
        <form.Field
          name="StudentCourses"
          mode="array"
          // validators={{
          //   onSubmitAsync: (value) => {
          //     if (value === null || value === undefined) {
          //       return t.studentCourses.validations.coursesValidation;
          //     }
          //     return z.array(z.any()).min(1).safeParse(value.value).success
          //       ? undefined
          //       : t.studentCourses.validations.coursesValidation;
          //   },
          // }}
          children={(field) => (
            <div className="flex flex-col space-y-5">
              <div className="grid grid-cols-6">
                <span className="col-span-6">
                  {t.studentCourses.form.addCourse}
                </span>
                <div className="col-span-6 mt-3">
                  <ToggleButton
                    options={[
                      { key: true, value: t.studentCourses.form.scholarLevels },
                      { key: false, value: t.studentCourses.form.courses },
                    ]}
                    setItemSelected={(x: { key: boolean; value: string }) => {
                      setIsLevelCourses(x.key);
                    }}
                    itemSelected={isLevelCourses}
                  />
                </div>
                {isLevelCourses ? (
                  <>
                    <span className="col-span-2 mt-5">
                      {t.studentCourses.form.scholarLevels}
                    </span>
                    <div className="col-span-4 mt-4">
                      <Combobox
                        options={scholarLevels}
                        textAttribute={"Name"}
                        valueAttribute="LevelId"
                        placeholder={t.studentCourses.form.scholarLevels}
                        setItemSelected={(x: LevelsTableViewModel) => {
                          x.LevelCourses.map((courses) => {
                            if (
                              !field.state.value
                                ?.map((v) => v.CourseId)
                                .includes(courses.CourseId)
                            )
                              field.pushValue({
                                CourseId: courses.CourseId,
                              });
                          });
                        }}
                        disabled={action === "view"}
                        showSearch
                        notClearable
                      />
                    </div>
                  </>
                ) : (
                  <>
                    <span className="col-span-2 mt-5 md:col-span-1">
                      {t.studentCourses.form.coursePeriod}
                    </span>
                    <div className="col-span-4 mt-4 md:col-span-5">
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
                        notClearable
                      />
                    </div>
                    <span className="col-span-2 mt-3 md:col-span-1">
                      {t.studentCourses.form.studentCourses}
                    </span>
                    <div className="col-span-4 mt-2 md:col-span-5">
                      <Combobox
                        options={courses}
                        textAttribute={["Name", "CourseCode"]}
                        valueAttribute="CourseId"
                        placeholder={t.studentCourses.form.studentCourses}
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
                      {/* <div className="text-xs text-red-500">
                    {field.state.meta.errors
                      ? field.state.meta.errors.join(", ")
                      : null}
                  </div> */}
                    </div>
                  </>
                )}
              </div>
              <div className="space-y-3 rounded-md border bg-muted p-2">
                <div className="grid grid-cols-12">
                  <div className="col-span-7 text-sm font-semibold">
                    {t.studentCourses.columns.name}
                  </div>
                  <div className="col-span-3 text-sm font-semibold">
                    {t.studentCourses.columns.courseCode}
                  </div>
                  <div className="col-span-1 text-sm font-semibold">
                    {t.studentCourses.columns.note}
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
                      <div className="col-span-3 text-sm">
                        {` ${
                          allCourses.find(
                            (x) => x.CourseId === studentCourse.CourseId,
                          )?.CourseCode
                        } `}
                      </div>
                      <div className="col-span-1 text-sm">
                        {studentCoursesData?.StudentCourses.find(
                          (x) => x.CourseId === studentCourse.CourseId,
                        )?.Note !== undefined &&
                          studentCoursesData?.StudentCourses.find(
                            (x) => x.CourseId === studentCourse.CourseId,
                          )?.Note !== null &&
                          studentCoursesData?.StudentCourses.find(
                            (x) => x.CourseId === studentCourse.CourseId,
                          )?.Note}
                      </div>
                      {(studentCoursesData?.StudentCourses.find(
                        (x) => x.CourseId === studentCourse.CourseId,
                      )?.Note !== undefined &&
                        studentCoursesData?.StudentCourses.find(
                          (x) => x.CourseId === studentCourse.CourseId,
                        )?.Note !== null) || (
                        <Icon
                          name={
                            isValidIconName("MdClose")
                              ? "MdClose"
                              : "MdOutlineNotInterested"
                          }
                          className="col-span-1 cursor-pointer place-self-end text-xl hover:text-primary"
                          onClick={() => field.removeValue(index)}
                        />
                      )}
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
              onClick={() =>
                router.push(
                  `/courses/studentCourses?scholarPeriodId=${scholarPeriodIdParam}`,
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
              onClick={() => router.back()}
            >
              {t.shared.cancel}
            </Button>
          </div>
        )}
      </div>
      {/* <pre>{JSON.stringify(studentCoursesData, null, 2)}</pre> */}
    </form>
  );
}
