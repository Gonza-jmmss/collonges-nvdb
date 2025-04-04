"use client";

import { useState, useMemo, useEffect } from "react";
import deleteStudentCourseGradesCommand from "@/repositories/studentCourseGrades/commands/deleteStudentCourseGradesCommand";
import {
  StudentCourseGradeByActivityViewModel,
  StudentCourseGradeByActivity,
} from "@/repositories/studentCourseGrades/studentCourseGradesViewModel";
import { CourseViewModel } from "@/repositories/courses/coursesViewModel";
import { CurentLevelsViewModel } from "@/repositories/levels/levelsViewModel";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/common/combobox";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import enumToArray from "@/functions/enumToArray";
import formatDate from "@/functions/formatDate";
import Modal from "@/components/common/modal";
import { PeriodEnum } from "@/enum/periodEnum";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function StudentCoruseGradesByActivityTable({
  studentCourseGradesByActivity,
  periodIdSelected,
  courses,
  courseIdSelected,
  levels,
  levelIdSelected,
  tabValue,
  urlParams,
}: {
  studentCourseGradesByActivity: StudentCourseGradeByActivityViewModel[];
  periodIdSelected: number;
  courses: CourseViewModel[];
  courseIdSelected: number;
  levels: CurentLevelsViewModel[];
  levelIdSelected: number | null;
  tabValue: string;
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const router = useRouter();
  const { toast } = useToast();
  const updateQuery = useUpdateQuery();

  const [openModal, setOpenModal] = useState(false);
  const [
    selectedStudentCourseGradeToDelete,
    setSelectedStudentCourseGradeToDelete,
  ] = useState<StudentCourseGradeByActivityViewModel | null>();

  const closeModal = () => {
    setOpenModal(false);
    setSelectedStudentCourseGradeToDelete(null);
  };

  const activityGradesEmptyCondition = (
    studentCourseGrade: StudentCourseGradeByActivityViewModel,
  ) => {
    return studentCourseGrade.Activities.map((activity) => activity.Grade).some(
      (grade) => grade === "NaN",
    );
  };

  const columns = useMemo<
    ColumnDef<StudentCourseGradeByActivityViewModel, any>[]
  >(
    () => [
      {
        accessorKey: "",
        id: "1",
        header: () => <Header text="" />,
        cell: ({ row }) => (
          <div
            style={{
              paddingLeft: `${row.depth * 2}rem`,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            {row.original.Activities.length > 0 && row.getCanExpand() ? (
              <div onClick={row.getToggleExpandedHandler()}>
                {row.getIsExpanded() ? (
                  <Icon
                    name={
                      isValidIconName("MdArrowDownward")
                        ? "MdArrowDownward"
                        : "MdOutlineNotInterested"
                    }
                    className="cursor-pointer"
                  />
                ) : (
                  <Icon
                    name={
                      isValidIconName("MdArrowForward")
                        ? "MdArrowForward"
                        : "MdOutlineNotInterested"
                    }
                    className="cursor-pointer"
                  />
                )}
              </div>
            ) : (
              <Icon
                name={
                  isValidIconName("MdHorizontalRule")
                    ? "MdHorizontalRule"
                    : "MdOutlineNotInterested"
                }
              />
            )}
          </div>
        ),
        size: 5,
      },
      {
        accessorKey: "Description",
        id: "Description",
        header: () => (
          <Header text={t.studentCourseGrades.columnsByActivity.description} />
        ),
        filterFn: "equalsString",
        size: 200,
      },
      {
        accessorKey: "GradeCoefficientName",
        id: "GradeCoefficientName",
        header: () => (
          <Header
            text={t.studentCourseGrades.columnsByActivity.gradeCoefficientName}
          />
        ),
        filterFn: "equalsString",
        size: 40,
      },
      {
        accessorKey: "CreatedAt",
        id: "CreatedAt",
        header: () => (
          <Header text={t.studentCourseGrades.columnsByActivity.createdAt} />
        ),
        filterFn: "equalsString",
        cell: (row) =>
          row.getValue() !== null ? formatDate(row.getValue()) : "",
        size: 40,
      },
      {
        accessorKey: "LevelName",
        id: "LevelName",
        header: () => (
          <Header text={t.studentCourseGrades.columnsByActivity.levelName} />
        ),
        filterFn: "equalsString",
        size: 40,
      },
      {
        accessorKey: "UserName",
        id: "UserName",
        header: () => (
          <Header text={t.studentCourseGrades.columnsByActivity.userName} />
        ),
        filterFn: "equalsString",
        size: 40,
      },
      {
        accessorKey: "actions",
        id: "actions",
        header: () => <Header text={t.shared.actions} />,
        size: 20,
        cell: (row) => (
          <div
            className="flex space-x-1"
            onClick={(event) => event.stopPropagation()}
          >
            <Icon
              name={
                isValidIconName("MdEdit") ? "MdEdit" : "MdOutlineNotInterested"
              }
              className="cursor-pointer text-xl hover:text-primary"
              onClick={() =>
                router.push(
                  `/courses/studentCourseGrades/edit?action="edit"&periodId=${periodIdSelected}&levelId=${levelIdSelected}&courseId=${courseIdSelected}&description=${row.row.original.Description}&createdAt=${encodeURIComponent(row.row.original.CreatedAt.toUTCString())}&tab=${tabValue}`,
                )
              }
            />
            <Icon
              name={
                isValidIconName("MdDelete")
                  ? "MdDelete"
                  : "MdOutlineNotInterested"
              }
              className={`cursor-pointer text-xl hover:text-destructive ${
                activityGradesEmptyCondition(row.row.original) === true
                  ? "text-primary"
                  : ""
              }`}
              onClick={() => {
                setOpenModal(true);
                setSelectedStudentCourseGradeToDelete(row.row.original);
              }}
            />
          </div>
        ),
      },
    ],
    [],
  );

  const columnsExtended = useMemo<
    ColumnDef<StudentCourseGradeByActivity, any>[]
  >(
    () => [
      {
        accessorKey: "StudentName",
        id: "StudentName",
        header: () => (
          <Header text={t.studentCourseGrades.expandedByActivity.studentName} />
        ),
        filterFn: "equalsString",
        // cell: (row) => (
        //   <span>{`${row.getValue()} (${row.row.original.AverageGrade})`}</span>
        // ),
      },
      {
        accessorKey: "Grade",
        id: "Grade",
        header: () => (
          <Header text={t.studentCourseGrades.expandedByActivity.grade} />
        ),
        filterFn: "equalsString",
        cell: (row) => (
          <span>{row.getValue() === "NaN" ? "-" : row.getValue()}</span>
        ),
      },
      {
        accessorKey: "AverageGrade",
        id: "AverageGrade",
        header: () => (
          <Header
            text={t.studentCourseGrades.expandedByActivity.averageGrade}
          />
        ),
        filterFn: "equalsString",
        size: 30,
      },
    ],
    [],
  );

  const deleteStudentCourseGrades = async (
    StudentCourseGradeToDelete: StudentCourseGradeByActivityViewModel,
  ) => {
    try {
      const studentCourseGradeIdsToDelete =
        StudentCourseGradeToDelete.Activities.map(
          (activity) => activity.StudentCourseGradeId,
        );

      // Delete StudentCourseGrades
      const response = await deleteStudentCourseGradesCommand(
        studentCourseGradeIdsToDelete,
      );

      if (!response) {
        throw new Error(`${t.gradeCoefficients.notifications.deleteFailure}`);
      }
      toast({
        title: `${t.gradeCoefficients.notifications.deleteSuccess}`,
        description: `${t.gradeCoefficients.title} : ${StudentCourseGradeToDelete.Description}`,
      });

      router.refresh();
      closeModal();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.gradeCoefficients.notifications.deleteError}`,
        description: `${error}`,
      });
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
    <div>
      <div className="mt-3 flex items-center justify-between">
        <div className="-ml-3 flex flex-wrap justify-start space-x-3 space-y-3 2xl:flex-row 2xl:items-center 2xl:space-y-0">
          <div />
          <div className="w-[15rem]">
            <Combobox
              options={enumToArray(PeriodEnum)}
              textAttribute="value"
              valueAttribute="key"
              placeholder={t.courses.form.periodNumber}
              itemSelected={enumToArray(PeriodEnum).find(
                (x) => x.key === periodIdSelected,
              )}
              setItemSelected={(x: { key: number }) => {
                handleUrlParameterChange("periodId", `${x.key}`);
                handleUrlParameterChange("courseId", `${0}`);
              }}
              notClearable
            />
          </div>
          <div className="w-[15rem]">
            <Combobox
              options={levels}
              textAttribute="Name"
              valueAttribute="LevelId"
              placeholder={t.studentCourseGrades.level}
              itemSelected={levels.find((x) => x.LevelId === levelIdSelected)}
              setItemSelected={(x: CurentLevelsViewModel) => {
                handleUrlParameterChange("levelId", `${x ? x.LevelId : null}`);
                handleUrlParameterChange("courseId", `${0}`);
              }}
            />
          </div>
          <div className="w-[30rem]">
            <Combobox
              options={courses}
              textAttribute={["CourseCode", "Name"]}
              valueAttribute="CourseId"
              placeholder={t.studentCourseGrades.columnsByStudent.courseName}
              itemSelected={courses.find(
                (x) => x.CourseId === courseIdSelected,
              )}
              setItemSelected={(x: CourseViewModel) => {
                handleUrlParameterChange("courseId", `${x.CourseId}`);
              }}
              notClearable
            />
          </div>
        </div>
        <Button
          variant="outlineColored"
          onClick={() =>
            router.push(
              `/courses/studentCourseGrades/create?action="create"&periodId=${periodIdSelected}&levelId=${levelIdSelected}&courseId=${courseIdSelected}&tab=${tabValue}`,
            )
          }
        >
          <span>{t.studentCourseGrades.create}</span>
        </Button>
      </div>
      <Table
        columns={columns}
        data={studentCourseGradesByActivity}
        className=""
        expandable
        expandedContent={(row) => (
          <Table
            columns={columnsExtended}
            data={row.Activities}
            minimalMode
            noBorders
          />
        )}
      />
      <Modal openModal={openModal} closeModal={closeModal}>
        <div>
          {selectedStudentCourseGradeToDelete &&
            activityGradesEmptyCondition(selectedStudentCourseGradeToDelete) ===
              false && (
              <>
                <div className="flex w-full flex-col items-center space-y-1">
                  <div className="mt-2 text-lg font-semibold">{`${t.studentCourseGrades.delteModalValidation.title}`}</div>
                  <div>{`${t.studentCourseGrades.delteModalValidation.description}`}</div>
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
                </div>
              </>
            )}
          {selectedStudentCourseGradeToDelete &&
            activityGradesEmptyCondition(selectedStudentCourseGradeToDelete) ===
              true && (
              <>
                <div className="flex w-full flex-col items-center space-y-1">
                  <div className="mt-2 text-lg font-semibold">{`${t.studentCourseGrades.deleteModal.deleteTitle}`}</div>
                  <div>{`${t.studentCourseGrades.deleteModal.deleteDescription}`}</div>
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
                    onClick={() =>
                      selectedStudentCourseGradeToDelete &&
                      deleteStudentCourseGrades(
                        selectedStudentCourseGradeToDelete,
                      )
                    }
                  >
                    {t.shared.confirm}
                  </Button>
                </div>
              </>
            )}
        </div>
      </Modal>
      {/* <pre>{JSON.stringify(studentCourseGradesByActivity, null, 2)}</pre> */}
    </div>
  );
}
