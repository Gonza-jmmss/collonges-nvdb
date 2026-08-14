"use client";

import { useState, useEffect, useMemo } from "react";
import createStudentCourseGradesCommand from "@/repositories/studentCourseGrades/commands/createStudentCourseGradesCommand";
import updateStudentCourseGradesCommand from "@/repositories/studentCourseGrades/commands/updateStudentCourseGradesCommand";
import { StudentCourseGradesByCourseIdViewModel } from "@/repositories/studentCourseGrades/studentCourseGradesViewModel";
import { CourseViewModel } from "@/repositories/courses/coursesViewModel";
import { CurentLevelsViewModel } from "@/repositories/levels/levelsViewModel";
import { ScholarPeriodsViewModel } from "@/repositories/scholarPeriods/scholarPeriodsViewModel";
import { StudentsByCourseIdViewModel } from "@/repositories/studentCourses/studentCoursesViewModel";
import { GradeCoefficientsViewModel } from "@/repositories/gradeCoefficients/gradeCoefficientsViewModel";
import { StudentCourseGradeSchema } from "@/zodSchemas/studentCourseGradeSchema";
import { useForm, useStore } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/common/combobox";
import Modal from "@/components/common/modal";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { z } from "zod";
import frFR from "@/lang/fr-FR";

type StudentCourseGradeFormData = z.infer<typeof StudentCourseGradeSchema>;

export default function StudentCourseGradesForm({
  studentCourseGradeData,
  courses,
  levels,
  scholarPeriods,
  studentByCouse,
  gradeCoefficients,
  tearcherId,
  pageIndexParam,
  pageSizeParam,
  action,
  urlParams,
}: {
  studentCourseGradeData: StudentCourseGradesByCourseIdViewModel | null;
  courses: CourseViewModel[];
  levels: CurentLevelsViewModel[];
  scholarPeriods: ScholarPeriodsViewModel[];
  gradeCoefficients: GradeCoefficientsViewModel[];
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

  const [changePeriod, setChangePeriod] = useState(false);

  const [isPending, setIsPending] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [confirmedStudentCourseGradeData, setConfirmedStudentCourseGradeData] =
    useState<StudentCourseGradeFormData | null>(null);

  // const periodNumberParam = parseInt(urlParams?.periodNumber as string);
  const levelIdParam =
    urlParams?.levelId !== null ? parseInt(urlParams?.levelId as string) : null;
  const courseIdParam = parseInt(urlParams?.courseId as string);
  const scholarPeriodIdParam = parseInt(urlParams?.scholarPeriodId as string);
  const tabParam = urlParams?.tab as string;

  const form = useForm<StudentCourseGradeFormData>({
    defaultValues: {
      GradeCoefficientId:
        action !== "create"
          ? (studentCourseGradeData?.GradeCoefficientId ?? 0)
          : 0,
      UserId:
        action !== "create"
          ? (studentCourseGradeData?.UserId ?? tearcherId)
          : tearcherId,
      Description:
        action !== "create" ? (studentCourseGradeData?.Description ?? "") : "",
      ActivityDate:
        action !== "create"
          ? (studentCourseGradeData?.ActivityDate ?? new Date())
          : new Date(),
      StudentCourses:
        action !== "create"
          ? (studentCourseGradeData?.StudentCourses?.map((studentCourse) => ({
              StudentCourseGradeId: studentCourse.StudentCourseGradeId,
              StudentCourseId: studentCourse.StudentCourseId,
              Grade: studentCourse.Grade,
            })) ?? null)
          : null,
    },
    onSubmit: async ({ value }) => {
      // console.log("formData", value);
      action && gradesValidation(value, action);
    },
  });

  const gradesValidation = async (
    formData: StudentCourseGradeFormData,
    action: string,
  ) => {
    const allStudentCoursesHasGrades =
      form
        .getFieldValue("StudentCourses")
        ?.map((studentCourse) => studentCourse.Grade)
        .some((grade) => grade !== "NaN" && grade !== "") === true;

    if (allStudentCoursesHasGrades) {
      setIsPending(true);
      action === "create" && createStudentCourseGrades(formData);
      action === "edit" && updateStudentCourseGrades(formData);
    } else {
      setOpenModal(true);
      setConfirmedStudentCourseGradeData(formData);
    }
  };

  const createStudentCourseGrades = async (
    formData: StudentCourseGradeFormData,
  ) => {
    try {
      const response = await createStudentCourseGradesCommand(formData);

      if (!response) {
        throw new Error(`${t.studentCourseGrades.notifications.createFailure}`);
      }
      toast({
        title: `${t.studentCourseGrades.notifications.createSuccess}`,
        description: `${t.studentCourseGrades.title} : ${courses.find((x) => x.CourseId === courseIdParam)?.CourseCode} - ${form.getFieldValue("Description")}`,
      });

      router.push(
        `/courses/studentCourseGrades?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&levelId=${levelIdParam || null}&courseId=${courseIdParam}${scholarPeriodIdParam ? `&scholarPeriodId=${scholarPeriodIdParam}` : ""}&tab=${tabParam}`,
      );
      // router.push(
      //   `/courses/studentCourseGrades?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&periodNumber=${periodNumberParam}&levelId=${levelIdParam || null}&courseId=${courseIdParam}${scholarPeriodIdParam ? `&scholarPeriodId=${scholarPeriodIdParam}` : ""}&tab=${tabParam}`,
      // );
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.studentCourseGrades.notifications.createError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
      openModal === true && closeModal();
    }
  };

  const updateStudentCourseGrades = async (
    formData: StudentCourseGradeFormData,
  ) => {
    try {
      const response = await updateStudentCourseGradesCommand(formData);

      if (!response) {
        throw new Error(`${t.studentCourseGrades.notifications.updateFailure}`);
      }
      toast({
        title: `${t.studentCourseGrades.notifications.updateSuccess}`,
        description: `${t.studentCourseGrades.title} : ${courses.find((x) => x.CourseId === courseIdParam)?.CourseCode} - ${response[0].Description}`,
      });

      router.push(
        `/courses/studentCourseGrades?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&levelId=${levelIdParam || null}&courseId=${courseIdParam}${scholarPeriodIdParam ? `&scholarPeriodId=${scholarPeriodIdParam}` : ""}&tab=${tabParam}`,
      );
      // router.push(
      //   `/courses/studentCourseGrades?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&periodNumber=${periodNumberParam}&levelId=${levelIdParam || null}&courseId=${courseIdParam}${scholarPeriodIdParam ? `&scholarPeriodId=${scholarPeriodIdParam}` : ""}&tab=${tabParam}`,
      // );
      router.refresh();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.studentCourseGrades.notifications.updateError}`,
        description: `${error}`,
      });
    } finally {
      setIsPending(false);
      openModal === true && closeModal();
    }
  };

  const confirmAction = async () => {
    if (confirmedStudentCourseGradeData) {
      if (action === "create") {
        await createStudentCourseGrades(confirmedStudentCourseGradeData);
      } else {
        await updateStudentCourseGrades(confirmedStudentCourseGradeData);
      }
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

  // const [periodNumberRender, setPeriodNumberRender] = useState(0);
  // useEffect(() => {
  //   if (periodNumberRender > 0) {
  //     if (courses.length > 0) {
  //       handleUrlParameterChange("courseId", `${courses[0].CourseId}`);
  //     }
  //   } else {
  //     setPeriodNumberRender(1);
  //   }
  // }, [urlParams?.periodNumber]);

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

  const [scholarPeriodIdRender, setScholarPeriodIdRender] = useState(0);
  useEffect(() => {
    if (scholarPeriodIdRender > 0) {
      if (courses.length > 0) {
        handleUrlParameterChange("courseId", `${courses[0].CourseId}`);
      }
    } else {
      setScholarPeriodIdRender(1);
    }
  }, [urlParams?.scholarPeriodId]);

  const eraseGrades = () => {
    // console.log("studentByCouse", form.getFieldValue("StudentCourses"));
    const mappedStuents = form
      .getFieldValue("StudentCourses")
      ?.map((studentCourses) => ({
        StudentCourseGradeId: studentCourses.StudentCourseGradeId,
        StudentCourseId: studentCourses.StudentCourseId,
        Grade: NaN.toLocaleString(),
      }));

    // Set the StudentCourses field value
    form.setFieldValue(
      "StudentCourses",
      mappedStuents || form.getFieldValue("StudentCourses"),
    );
  };

  const closeModal = () => {
    setOpenModal(false);
    setConfirmedStudentCourseGradeData(null);
  };

  useEffect(() => {
    // Get the current StudentCourses array from the form (or initialize with empty array)
    const currentStudentCourses = form.getFieldValue("StudentCourses") || [];

    // Build a lookup map of existing form entries keyed by StudentCourseId,
    // so we can quickly check "do we already have this student in the form?"
    // and re-use their existing Grade / StudentCourseGradeId instead of resetting them.
    const currentById = new Map(
      currentStudentCourses.map((sc) => [sc.StudentCourseId, sc]),
    );

    // Rebuild the StudentCourses array strictly from the current studentByCouse list
    // (the students that belong to the currently selected course).
    // This guarantees the form only ever contains students who are actually
    // in the current course - anyone left over from a previously selected
    // course gets dropped automatically since we're mapping over studentByCouse,
    // not over currentStudentCourses.
    const reconciled = studentByCouse.map((student) => {
      // If this student already exists in the form, keep their existing data
      // (preserves entered grades and StudentCourseGradeId when just re-rendering,
      // e.g. in edit/view mode, or when the effect re-runs without a real course change).
      const existing = currentById.get(student.StudentCourseId);

      // Otherwise, this is a new student for this course, so create a fresh
      // entry with no grade yet (NaN as a string, matching the rest of the form's convention).
      return (
        existing ?? {
          StudentCourseGradeId: null,
          StudentCourseId: student.StudentCourseId,
          Grade: NaN.toLocaleString(),
        }
      );
    });

    // Push the reconciled list back into the form state, replacing the old array.
    form.setFieldValue("StudentCourses", reconciled);
  }, [studentByCouse, form]);
  // Re-run whenever the list of students for the course changes (e.g. course/level switch),
  // or when the form instance itself changes.

  // Split and order the column alphabetically in a vertical order
  const studentCourses =
    useStore(form.store, (state) => state.values.StudentCourses) ?? [];

  const sorted = useMemo(() => {
    return [...studentCourses].sort((a, b) => {
      const nameA =
        studentByCouse.find((x) => x.StudentCourseId === a.StudentCourseId)
          ?.StudentName ?? "";
      const nameB =
        studentByCouse.find((x) => x.StudentCourseId === b.StudentCourseId)
          ?.StudentName ?? "";
      return nameA.localeCompare(nameB);
    });
  }, [studentCourses, studentByCouse]);

  const columns = useMemo(() => {
    const colCount = 2;
    const result = Array.from({ length: colCount }, () => [] as typeof sorted);
    const chunkSize = Math.ceil(sorted.length / colCount);
    for (let i = 0; i < colCount; i++) {
      result[i] = sorted.slice(i * chunkSize, (i + 1) * chunkSize);
    }
    return result;
  }, [sorted]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
        className="mt-3 grid grid-cols-1 gap-5"
      >
        <div className="col-span-2">
          <div>{t.studentCourseGrades.form.course}</div>
          <div className="mt-1 flex flex-col space-y-5 lg:flex-row lg:space-x-3 lg:space-y-0">
            <div className="w-full min-w-44 lg:w-[20%]">
              <Combobox
                options={levels}
                textAttribute="Name"
                valueAttribute="LevelId"
                placeholder={t.studentCourseGrades.level}
                itemSelected={levels.find((x) => x.LevelId === levelIdParam)}
                setItemSelected={(x: CurentLevelsViewModel) => {
                  handleUrlParameterChange(
                    "levelId",
                    `${x ? x.LevelId : null}`,
                  );
                }}
                disabled={action !== "create"}
              />
            </div>
            <div className="w-full lg:w-[70%] lg:min-w-[48%]">
              <Combobox
                options={courses}
                textAttribute={["CourseCode", "Name"]}
                valueAttribute="CourseId"
                placeholder={t.studentCourseGrades.columnsByStudent.courseName}
                itemSelected={courses.find((x) => x.CourseId === courseIdParam)}
                setItemSelected={(x: CourseViewModel) => {
                  handleUrlParameterChange("courseId", `${x.CourseId}`);
                }}
                disabled={action !== "create"}
                notClearable
              />
            </div>
            <Button
              type="button"
              variant={changePeriod ? "default" : "outlineColored"}
              onClick={() => setChangePeriod(!changePeriod)}
            >
              <span>{t.studentCourseGrades.changePeriod}</span>
            </Button>
          </div>
          {changePeriod ? (
            <>
              <div className="flex w-full justify-end">
                <div className="mt-3 w-full min-w-44 lg:w-[30%]">
                  <Combobox
                    options={scholarPeriods}
                    textAttribute="Name"
                    valueAttribute="ScholarPeriodId"
                    placeholder={t.studentCourses.filters.scholarPeriodId}
                    itemSelected={scholarPeriods.find(
                      (x) => x.ScholarPeriodId === scholarPeriodIdParam,
                    )}
                    setItemSelected={(x: ScholarPeriodsViewModel) => {
                      handleUrlParameterChange("levelId", "null");
                      handleUrlParameterChange(
                        "scholarPeriodId",
                        `${x.ScholarPeriodId}`,
                      );
                    }}
                    notClearable
                  />
                </div>
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <div className="col-span-2">
          <form.Field
            name="Description"
            children={(field) => (
              <>
                <span>{t.studentCourseGrades.form.description}</span>
                <Input
                  id="Description"
                  name="Description"
                  placeholder={`${t.studentCourseGrades.form.description}`}
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
            name="GradeCoefficientId"
            validators={{
              onSubmitAsync: (value) => {
                if (value === null || value === undefined) {
                  return t.studentCourseGrades.validations
                    .gradeCoefficientValidation;
                }
                return z.number().min(1).safeParse(value.value).success
                  ? undefined
                  : t.studentCourseGrades.validations
                      .gradeCoefficientValidation;
              },
            }}
            children={(field) => (
              <>
                <span>{t.studentCourseGrades.form.gradeCoefficientId}</span>
                <Combobox
                  options={gradeCoefficients}
                  // textAttribute="Name"
                  textAttribute={["Name", "CoefficientNumberText"]}
                  valueAttribute="GradeCoefficientId"
                  placeholder={t.studentCourseGrades.form.gradeCoefficientId}
                  itemSelected={gradeCoefficients.find(
                    (x) => x.GradeCoefficientId === field.state.value,
                  )}
                  setItemSelected={(x: { GradeCoefficientId: number }) => {
                    field.handleChange(x && x.GradeCoefficientId);
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
        <div className="col-span-2 space-y-1">
          <form.Field
            name="StudentCourses"
            mode="array"
            validators={{
              onSubmitAsync: (value) => {
                if (value === null || value === undefined) {
                  return t.studentCourseGrades.validations.coursesValidation;
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
                    {t.studentCourseGrades.form.students}
                  </span>
                  <Button
                    type="button"
                    variant={"ghost"}
                    className="w-32 text-primary"
                    onClick={() => eraseGrades()}
                  >
                    {t.studentCourseGrades.form.clearGrades}
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-5">
                  {columns &&
                    columns.map((col, colIdx) => (
                      <div key={colIdx} className="flex flex-col space-y-5">
                        {col.map((studentCourse) => {
                          const realIndex = studentCourses.findIndex(
                            (sc) =>
                              sc.StudentCourseId ===
                              studentCourse.StudentCourseId,
                          );

                          return (
                            <div
                              key={studentCourse.StudentCourseId}
                              className="rounded-md border border-foreground/30 p-2"
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
                                    name={`StudentCourses[${realIndex}].Grade`}
                                    children={(field) => (
                                      <>
                                        <span>
                                          {t.studentCourseGrades.form.grade}
                                        </span>
                                        <Input
                                          type="number"
                                          className="w-20 bg-background/30 text-center"
                                          value={
                                            field.state.value?.toLocaleString() ||
                                            ""
                                          }
                                          onWheel={(e) =>
                                            e.currentTarget.blur()
                                          }
                                          onKeyDown={(e) => {
                                            if (
                                              e.key === "ArrowUp" ||
                                              e.key === "ArrowDown"
                                            ) {
                                              e.preventDefault();
                                            }
                                          }}
                                          onChange={(e) => {
                                            let value = e.target.value;
                                            if (value.includes(".")) {
                                              const parts = value.split(".");
                                              if (parts[1].length > 2) {
                                                value = `${parts[0]}.${parts[1].substring(0, 2)}`;
                                              }
                                            }
                                            const numValue = parseFloat(value);
                                            if (
                                              !isNaN(numValue) &&
                                              numValue > 20
                                            ) {
                                              value = "20";
                                            }
                                            field.handleChange(value);
                                          }}
                                          disabled={action === "view"}
                                        />
                                      </>
                                    )}
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
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
                onClick={
                  () =>
                    router.push(
                      `/courses/studentCourseGrades?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&levelId=${levelIdParam || null}&courseId=${courseIdParam}${scholarPeriodIdParam ? `&scholarPeriodId=${scholarPeriodIdParam}` : ""}&tab=${tabParam}`,
                    )
                  // router.push(
                  //   `/courses/studentCourseGrades?pageIndex=${pageIndexParam}&pageSize=${pageSizeParam}&periodNumber=${periodNumberParam}&levelId=${levelIdParam || null}&courseId=${courseIdParam}${scholarPeriodIdParam ? `&scholarPeriodId=${scholarPeriodIdParam}` : ""}&tab=${tabParam}`,
                  // )
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
                onClick={() => router.back()}
              >
                {t.shared.cancel}
              </Button>
            </div>
          )}
        </div>
        {/* <pre>{JSON.stringify(studentCoursesData, null, 2)}</pre> */}
      </form>
      <Modal openModal={openModal} closeModal={closeModal}>
        <div>
          <div className="flex w-full flex-col items-center space-y-1">
            <div className="mt-2 text-lg font-semibold">{`${t.studentCourseGrades.confirmtionModal.title}`}</div>
            <div>{`${t.studentCourseGrades.confirmtionModal.description}`}</div>
          </div>
          <div className="mt-5 flex w-full justify-center space-x-5">
            <Button
              type="button"
              variant={"secondary"}
              className="w-[30%]"
              onClick={closeModal}
            >
              {t.shared.cancel}
            </Button>
            <Button
              type="button"
              variant={"default"}
              className="w-[30%]"
              onClick={() => confirmAction()}
            >
              {t.shared.confirm}
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
