"use client";

import { useState, useEffect } from "react";
import createStudentCourseAttendanceCommand from "@/repositories/studentCourseAttendances/commands/createStudentCourseAttendanceCommand";
import updateStudentCourseAttendanceCommand from "@/repositories/studentCourseAttendances/commands/updateStudentCourseAttendanceCommand";
import { StudentCourseAttendancesByCourseIdViewModel } from "@/repositories/studentCourseAttendances/StudentCourseAttendancesViewModel";
import { CourseViewModel } from "@/repositories/courses/coursesViewModel";
import { CurentLevelsViewModel } from "@/repositories/levels/levelsViewModel";
import { StudentsByCourseIdViewModel } from "@/repositories/studentCourses/studentCoursesViewModel";
import { StudentCourseAttendancesSchema } from "@/zodSchemas/studentCoursesAttendancesSchema";
import { useForm } from "@tanstack/react-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Combobox from "@/components/common/combobox";
import CalendarInput from "@/components/common/calendarInput";
import enumToArray from "@/functions/enumToArray";
import { AttendanceValueAbbreviationEnum } from "@/enum/attendanceValueEnum";
import { AttendancePeriodEnum } from "@/enum/attendancePeriodEnum";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

type StudentCourseAttendanceFormData = z.infer<
  typeof StudentCourseAttendancesSchema
>;

export default function StudentCourseAttendanceForm({
  studentCourseAttendanceData,
  courses,
  levels,
  studentByCouse,
  tearcherId,
  pageIndexParam,
  pageSizeParam,
  action,
  urlParams,
}: {
  studentCourseAttendanceData: StudentCourseAttendancesByCourseIdViewModel | null;
  courses: CourseViewModel[];
  levels: CurentLevelsViewModel[];
  studentByCouse: StudentsByCourseIdViewModel[];
  tearcherId: number;
  pageIndexParam: number;
  pageSizeParam: number;
  action: string | undefined;
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const { toast } = useToast();
  const router = useRouter();
  const updateQuery = useUpdateQuery();

  const [otherPeriod, setOtherPeriod] = useState(false);

  const [isPending, setIsPending] = useState(false);

  const attendanceDateParam = new Date(urlParams?.attendanceDate as string);
  const levelIdParam =
    urlParams?.levelId !== null ? parseInt(urlParams?.levelId as string) : null;
  const courseIdParam = parseInt(urlParams?.courseId as string);
  const tabParam = urlParams?.tab as string;

  const form = useForm<StudentCourseAttendanceFormData>({
    defaultValues: {
      UserId:
        action !== "create"
          ? (studentCourseAttendanceData?.UserId ?? tearcherId)
          : tearcherId,
      AttendanceDate:
        action !== "create"
          ? (studentCourseAttendanceData?.AttendanceDate ?? attendanceDateParam)
          : attendanceDateParam,
      AttendancePeriod:
        action !== "create"
          ? (studentCourseAttendanceData?.AttendancePeriod ?? null)
          : null,
      StudentCourseAttendances:
        action !== "create"
          ? (studentCourseAttendanceData?.StudentCourseAttendances?.map(
              (studentAttendance) => ({
                StudentCourseAttendanceId:
                  studentAttendance.StudentCourseAttendanceId,
                StudentCourseId: studentAttendance.StudentCourseId,
                AttendanceValue: studentAttendance.AttendanceValue,
              }),
            ) ?? null)
          : null,
    },
    onSubmit: async ({ value }) => {
      // console.log("formData", value);
      setIsPending(true);
      action === "create" && createStudentCourseAttendances(value);
      action === "edit" && updateStudentCourseAttendance(value);
    },
  });

  const createStudentCourseAttendances = async (
    formData: StudentCourseAttendanceFormData,
  ) => {
    try {
      const response = await createStudentCourseAttendanceCommand(formData);

      if (!response) {
        throw new Error(
          `${t.studentCourseAttendances.notifications.createFailure}`,
        );
      }
      toast({
        title: `${t.studentCourseAttendances.notifications.createSuccess}`,
        description: `${t.studentCourseAttendances.title} : ${courses.find((x) => x.CourseId === courseIdParam)?.CourseCode} - ${courses.find((x) => x.CourseId === courseIdParam)?.Name}}`,
      });

      router.push(
        `/courses/studentCourseAttendances?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&attendanceDate=${attendanceDateParam.toUTCString()}&tab=${tabParam}`,
      );
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.studentCourseAttendances.notifications.createError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
    }
  };

  const updateStudentCourseAttendance = async (
    formData: StudentCourseAttendanceFormData,
  ) => {
    try {
      const response = await updateStudentCourseAttendanceCommand(formData);

      if (!response) {
        throw new Error(
          `${t.studentCourseAttendances.notifications.updateFailure}`,
        );
      }
      toast({
        title: `${t.studentCourseAttendances.notifications.updateSuccess}`,
        description: `${t.studentCourseAttendances.title} : ${courses.find((x) => x.CourseId === courseIdParam)?.CourseCode} - ${courses.find((x) => x.CourseId === courseIdParam)?.Name}`,
      });

      router.push(
        `/courses/studentCourseAttendances?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&attendanceDate=${attendanceDateParam.toUTCString()}&tab=${tabParam}`,
      );
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.studentCourseAttendances.notifications.updateError}`,
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

  const [periodNumberRender, setPeriodNumberRender] = useState(0);
  useEffect(() => {
    if (periodNumberRender > 0) {
      if (courses.length > 0) {
        handleUrlParameterChange("courseId", `${courses[0].CourseId}`);
      }
    } else {
      setPeriodNumberRender(1);
    }
  }, [urlParams?.periodNumber]);

  const [levelIdRender, setLevelIdRender] = useState(0);
  useEffect(() => {
    if (levelIdRender > 0) {
      if (courses.length > 0) {
        handleUrlParameterChange("courseId", `${courses[0].CourseId}`);
      }
    } else {
      setLevelIdRender(1);
    }
  }, [urlParams?.levelId]);

  useEffect(() => {
    if (studentByCouse && action === "create") {
      // Map the existing student courses to the format expected by the form
      const mappedStuents = studentByCouse.map((student) => ({
        StudentCourseAttendanceId: null,
        StudentCourseId: student.StudentCourseId,
        AttendanceValue: 0,
        AttendancePeriod: null,
      }));

      // Set the StudentCourses field value
      form.setFieldValue("StudentCourseAttendances", mappedStuents);
    }
  }, [studentByCouse, form.setFieldValue]);

  useEffect(() => {
    const formStudentCoursesIds = form
      .getFieldValue("StudentCourseAttendances")
      ?.map((x) => x.StudentCourseId);
    const allStudentCoursesIds = studentByCouse.map((x) => x.StudentCourseId);

    // First, make sure formStudentCoursesIds is not null or undefined
    const existingIds = formStudentCoursesIds || [];

    // Find the missing IDs (ones in allStudentCoursesIds but not in formStudentCoursesIds)
    const missingIds = allStudentCoursesIds.filter(
      (id) => !existingIds.includes(id),
    );

    // Create new StudentCourse objects for the missing IDs
    // Each new object will have StudentCourseId and Grade: null
    const newStudentCourses = missingIds.map((id) => ({
      StudentCourseAttendanceId: null,
      StudentCourseId: id,
      AttendanceValue: null,
      AttendancePeriod: null,
    }));

    // Get the current StudentCourses array from the form (or initialize with empty array)
    const currentStudentCourses =
      form.getFieldValue("StudentCourseAttendances") || [];

    // Combine current StudentCourses with new ones
    const updatedStudentCourses = [
      ...currentStudentCourses,
      ...newStudentCourses,
    ];

    // Update the form with the combined array
    form.setFieldValue("StudentCourseAttendances", updatedStudentCourses);
  }, [studentByCouse, form]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2"
      >
        <div className="col-span-1 md:col-span-2">
          <div>{t.studentCourseAttendances.form.course}</div>
          <div className="mt-1 flex flex-col space-y-5 md:flex-row md:space-x-3 md:space-y-0">
            <Combobox
              options={levels}
              textAttribute="Name"
              valueAttribute="LevelId"
              placeholder={t.studentCourseAttendances.form.level}
              itemSelected={levels.find((x) => x.LevelId === levelIdParam)}
              setItemSelected={(x: CurentLevelsViewModel) => {
                handleUrlParameterChange("levelId", `${x ? x.LevelId : null}`);
              }}
              disabled={action !== "create"}
            />
            <Combobox
              options={courses}
              textAttribute={["CourseCode", "Name"]}
              valueAttribute="CourseId"
              placeholder={t.studentCourseAttendances.form.course}
              itemSelected={courses.find((x) => x.CourseId === courseIdParam)}
              setItemSelected={(x: CourseViewModel) => {
                handleUrlParameterChange("courseId", `${x.CourseId}`);
              }}
              disabled={action !== "create"}
              notClearable
            />
          </div>
        </div>
        <div className="col-span-1 space-y-1">
          <form.Field
            name="AttendanceDate"
            validators={{
              onSubmitAsync: (value) => {
                if (value === null || value === undefined) {
                  return t.studentCourseAttendances.validations
                    .attendanceDateValidation;
                }
                return z.date().safeParse(value.value).success
                  ? undefined
                  : t.studentCourseAttendances.validations
                      .attendanceDateValidation;
              },
            }}
            children={(field) => (
              <>
                <span>{t.studentCourseAttendances.form.attendanceDate}</span>

                <CalendarInput
                  dateValue={field.state.value}
                  setDateValue={(x: Date) => {
                    field.handleChange(x);
                  }}
                  disabled={action === "view"}
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
            name="AttendancePeriod"
            validators={{
              onSubmitAsync: (value) => {
                if (value === null || value === undefined) {
                  return t.studentCourseAttendances.validations
                    .attendancePeriodValidation;
                }
                return z.number().safeParse(value.value).success
                  ? undefined
                  : t.studentCourseAttendances.validations
                      .attendancePeriodValidation;
              },
            }}
            children={(field) => (
              <>
                <span>{t.studentCourseAttendances.form.attendancePeriod}</span>
                <div className="flex space-x-3">
                  <Combobox
                    options={enumToArray(AttendancePeriodEnum)}
                    textAttribute="value"
                    valueAttribute="key"
                    placeholder={" "}
                    itemSelected={enumToArray(AttendancePeriodEnum).find(
                      (x) => x.key === field.state.value,
                    )}
                    setItemSelected={(x: { key: number }) =>
                      field.handleChange(x && x.key)
                    }
                    notClearable
                    disabled={otherPeriod || action === "view"}
                  />
                  <Button
                    type="button"
                    // variant={"outline"}
                    variant={`${otherPeriod ? "outlineColored" : "outline"}`}
                    onClick={() => setOtherPeriod(!otherPeriod)}
                    disabled={action === "view"}
                  >
                    {t.shared.other}
                  </Button>
                  <Input
                    id="AttendancePeriod"
                    name="AttendancePeriod"
                    type="number"
                    placeholder={`${t.studentCourseAttendances.form.attendancePeriod}`}
                    className="w-20"
                    value={field.state.value || ""}
                    onChange={(e) =>
                      field.handleChange(parseInt(e.target.value))
                    }
                    disabled={!otherPeriod || action === "view"}
                    required
                  />
                </div>
                <div className="text-xs text-red-500">
                  {field.state.meta.errors
                    ? field.state.meta.errors.join(", ")
                    : null}
                </div>
              </>
            )}
          />
        </div>
        <div className="col-span-1 space-y-1 md:col-span-2">
          <form.Field
            name="StudentCourseAttendances"
            mode="array"
            validators={{
              onSubmitAsync: (value) => {
                if (value === null || value === undefined) {
                  return t.studentCourseAttendances.validations
                    .studentCourseAttendancesValidation;
                }
                return z.array(z.any()).min(1).safeParse(value.value).success
                  ? undefined
                  : t.studentCourseGrades.validations.coursesValidation;
              },
            }}
            children={(field) => (
              <div className="flex flex-col space-y-5 rounded-md border bg-muted/50 p-2">
                <div className="flex items-center justify-between">
                  <span className="col-span-2 text-lg font-semibold">
                    {t.studentCourseAttendances.form.students}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  {field.state.value?.map((studentCourse, index) => (
                    <div
                      key={index}
                      className="col-span-2 rounded-md border border-foreground/30 p-2 xl:col-span-1"
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">
                          {
                            studentByCouse.find(
                              (x) =>
                                x.StudentCourseId ===
                                studentCourse.StudentCourseId,
                            )?.StudentName
                          }
                        </div>
                        <div className="flex items-center space-x-2 text-sm">
                          <form.Field
                            name={`StudentCourseAttendances[${index}].AttendanceValue`}
                            validators={{
                              onSubmitAsync: (value) => {
                                if (value === null || value === undefined) {
                                  return t.studentCourseAttendances.validations
                                    .attendanceValueValidation;
                                }
                                return z.number().min(0).safeParse(value.value)
                                  .success
                                  ? undefined
                                  : t.studentCourseAttendances.validations
                                      .attendanceValueValidation;
                              },
                            }}
                            children={(field) => (
                              <>
                                <div className="flex flex-col space-y-1">
                                  <Combobox
                                    options={enumToArray(
                                      AttendanceValueAbbreviationEnum,
                                    )}
                                    textAttribute="value"
                                    valueAttribute="key"
                                    placeholder={" "}
                                    itemSelected={enumToArray(
                                      AttendanceValueAbbreviationEnum,
                                    ).find((x) => x.key === field.state.value)}
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
                      </div>
                    </div>
                  ))}
                </div>
                <div className="text-xs text-red-500">
                  {field.state.meta.errors
                    ? field.state.meta.errors.join(", ")
                    : null}
                </div>
              </div>
            )}
          />
        </div>
        {/* <pre>{JSON.stringify(studentByCouse, null, 2)}</pre> */}
        <div className="col-span-1 md:col-span-2">
          {action !== "view" ? (
            <div className="flex justify-center space-x-3">
              <Button
                type="button"
                variant={"secondary"}
                className="w-[30%]"
                onClick={() =>
                  router.push(
                    `/courses/studentCourseAttendances?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&attendanceDate=${attendanceDateParam.toUTCString()}&tab=${tabParam}`,
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
                type="button"
                variant={"secondary"}
                className="w-[30%]"
                onClick={() =>
                  router.push(
                    `/courses/studentCourseAttendances?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&attendanceDate=${attendanceDateParam.toUTCString()}&tab=${tabParam}`,
                  )
                }
              >
                {t.shared.cancel}
              </Button>
            </div>
          )}
        </div>
        {/* <pre>{JSON.stringify(studentCoursesData, null, 2)}</pre> */}
      </form>
    </>
  );
}
