"use client";

import { useState, useEffect } from "react";
import createStudentCourseGradesCommand from "@/repositories/studentCourseGrades/commands/createStudentCourseGradesCommand";
import updateStudentCourseGradesCommand from "@/repositories/studentCourseGrades/commands/updateStudentCourseGradesCommand";
import { StudentCourseGradesByCourseIdViewModel } from "@/repositories/studentCourseGrades/studentCourseGradesViewModel";
import { CourseViewModel } from "@/repositories/courses/coursesViewModel";
import { CurentLevelsViewModel } from "@/repositories/levels/levelsViewModel";
import { StudentsByCourseIdViewModel } from "@/repositories/studentCourses/studentCoursesViewModel";
import { GradeCoefficientsViewModel } from "@/repositories/gradeCoefficients/gradeCoefficientsViewModel";
import { StudentCourseGradeSchema } from "@/zodSchemas/studentCourseGradeSchema";
import { useForm } from "@tanstack/react-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/common/combobox";
import Modal from "@/components/common/modal";
import enumToArray from "@/functions/enumToArray";
import { PeriodEnum } from "@/enum/periodEnum";
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
  studentByCouse,
  gradeCoefficients,
  tearcherId,
  action,
  urlParams,
}: {
  studentCourseGradeData: StudentCourseGradesByCourseIdViewModel | null;
  courses: CourseViewModel[];
  levels: CurentLevelsViewModel[];
  gradeCoefficients: GradeCoefficientsViewModel[];
  studentByCouse: StudentsByCourseIdViewModel[];
  tearcherId: number;
  action: string | undefined;
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const { toast } = useToast();
  const router = useRouter();
  const updateQuery = useUpdateQuery();

  const [isPending, setIsPending] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [confirmedStudentCourseGradeData, setConfirmedStudentCourseGradeData] =
    useState<StudentCourseGradeFormData | null>(null);

  const periodIdParam = parseInt(urlParams?.periodId as string);
  const levelIdParam =
    urlParams?.levelId !== null ? parseInt(urlParams?.levelId as string) : null;
  const courseIdParam = parseInt(urlParams?.courseId as string);
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
      action === "create" && createValidation(value);
      action === "edit" && updateValidation(value);
    },
  });

  const createValidation = async (formData: StudentCourseGradeFormData) => {
    const studentCoursesHasGrades =
      form
        .getFieldValue("StudentCourses")
        ?.map((studentCourse) => studentCourse.Grade)
        .some((grade) => grade === "NaN") === false;
    if (studentCoursesHasGrades) {
      await createStudentCourseGrades(formData);
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
        `/courses/studentCourseGrades?periodId=${periodIdParam}&levelId=${levelIdParam || null}&courseId=${courseIdParam}&tab=${tabParam}`,
      );
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

  const updateValidation = async (formData: StudentCourseGradeFormData) => {
    const studentCoursesHasGrades =
      form
        .getFieldValue("StudentCourses")
        ?.map((studentCourse) => studentCourse.Grade)
        .some((grade) => grade === "NaN") === false;
    if (studentCoursesHasGrades) {
      await updateStudentCourseGrades(formData);
    } else {
      setOpenModal(true);
      setConfirmedStudentCourseGradeData(formData);
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
        `/courses/studentCourseGrades?periodId=${periodIdParam}&levelId=${levelIdParam || null}&courseId=${courseIdParam}&tab=${tabParam}`,
      );
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

  useEffect(() => {
    if (courses.length > 0) {
      handleUrlParameterChange("courseId", `${courses[0].CourseId}`);
    }
  }, [urlParams?.periodId]);

  useEffect(() => {
    if (courses.length > 0) {
      handleUrlParameterChange("courseId", `${courses[0].CourseId}`);
    }
  }, [urlParams?.levelId]);

  useEffect(() => {
    if (studentByCouse && action === "create") {
      // Map the existing student courses to the format expected by the form
      const mappedStuents = studentByCouse.map((student) => ({
        StudentCourseGradeId: null,
        StudentCourseId: student.StudentCourseId,
        Grade: NaN.toLocaleString(),
      }));

      // Set the StudentCourses field value
      form.setFieldValue("StudentCourses", mappedStuents);
    }
  }, [studentByCouse, form.setFieldValue]);

  const eraseGrades = () => {
    // console.log("studentByCouse", form.getFieldValue("StudentCourses"));
    const mappedStuents = form
      .getFieldValue("StudentCourses")
      ?.map((studentCourses) => ({
        StudentCourseGradeId: studentCourses.StudentCourseGradeId,
        StudentCourseId: studentCourses.StudentCourseId,
        Grade: NaN.toLocaleString(),
      }));

    console.log("mappedStuents", mappedStuents);
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
          <div className="mt-1 flex flex-col space-y-5 md:flex-row md:space-x-3 md:space-y-0">
            <Combobox
              options={enumToArray(PeriodEnum)}
              textAttribute="value"
              valueAttribute="key"
              placeholder={t.courses.form.periodNumber}
              itemSelected={enumToArray(PeriodEnum).find(
                (x) => x.key === periodIdParam,
              )}
              setItemSelected={(x: { key: number }) => {
                handleUrlParameterChange("periodId", `${x.key}`);
              }}
              disabled={action !== "create"}
              notClearable
            />
            <Combobox
              options={levels}
              textAttribute="Name"
              valueAttribute="LevelId"
              placeholder={t.studentCourseGrades.level}
              itemSelected={levels.find((x) => x.LevelId === levelIdParam)}
              setItemSelected={(x: CurentLevelsViewModel) => {
                handleUrlParameterChange("levelId", `${x ? x.LevelId : null}`);
              }}
              disabled={action !== "create"}
            />
          </div>
        </div>
        <div className="col-span-2">
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
        {/* {action === "edit" && (
          <div className="col-span-2 text-emerald-500">
            Est-ce que il est possible de changer le cours?
          </div>
        )} */}
        <div className="col-span-1 space-y-1">
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
                  textAttribute="Name"
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
              <div className="flex flex-col space-y-5 rounded-md border bg-muted p-2">
                {/* <span className="col-span-2 text-lg font-semibold">
                {t.studentCourseGrades.form.students}
              </span> */}
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
                            name={`StudentCourses[${index}].Grade`}
                            children={(field) => (
                              <>
                                <span>{t.studentCourseGrades.form.grade}</span>
                                <Input
                                  id="FirstName"
                                  name="FirstName"
                                  type="number"
                                  placeholder={``}
                                  className="w-20 bg-background/30 text-center"
                                  value={
                                    field.state.value?.toLocaleString() || ""
                                  }
                                  // onChange={(e) =>
                                  //   field.handleChange(
                                  //     parseFloat(
                                  //       e.target.value,
                                  //     ).toLocaleString(),
                                  //   )
                                  // }
                                  /////////////
                                  // onChange={(e) => {
                                  //   field.handleChange(e.target.value);
                                  // }}
                                  ////////////////
                                  onChange={(e) => {
                                    let value = e.target.value;

                                    // Check if the input has a decimal point
                                    if (value.includes(".")) {
                                      const parts = value.split(".");

                                      // Limit to 2 decimal places by truncating any additional digits
                                      if (parts[1].length > 2) {
                                        value = `${parts[0]}.${parts[1].substring(0, 2)}`;
                                      }
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
                    `/courses/studentCourseGrades?periodId=${periodIdParam}&levelId=${levelIdParam || null}&courseId=${courseIdParam}&tab=${tabParam}`,
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
