"use client";

import { useState, useMemo } from "react";
import deleteStudentCourseAttendanceCommand from "@/repositories/studentCourseAttendances/commands/deleteStudentCourseAttendanceCommand";
import {
  StudentCourseAttendancesByDayViewModel,
  StudentCourseAttendancesByDay,
} from "@/repositories/studentCourseAttendances/StudentCourseAttendancesViewModel";
import { ScholarPeriodsViewModel } from "@/repositories/scholarPeriods/scholarPeriodsViewModel";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import DeleteModal from "@/components/common/deleteModal";
import Icon from "@/components/common/icon";
import CalendarInput from "@/components/common/calendarInput";
import Combobox from "@/components/common/combobox";
import { Button } from "@/components/ui/button";
import formatDate from "@/functions/formatDate";
import { useRouter, useSearchParams } from "next/navigation";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { useToast } from "@/hooks/use-toast";
import frFR from "@/lang/fr-FR";

export default function AttendancesByDayTable({
  attendancesData,
  selectedAttendanceDate,
  // periodNumberSelected,
  courseIdSelected,
  // scholarPeriods,
  scholarPeriodSelected,
  tabValue,
  pageIndex,
  pageSize,
  urlParams,
}: {
  attendancesData: StudentCourseAttendancesByDayViewModel[];
  selectedAttendanceDate: Date;
  // periodNumberSelected: number;
  courseIdSelected: number;
  // scholarPeriods: ScholarPeriodsViewModel[];
  scholarPeriodSelected: number;
  tabValue: string;
  pageIndex: number;
  pageSize: number;
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const router = useRouter();
  const { toast } = useToast();
  const updateQuery = useUpdateQuery();
  const searchParams = useSearchParams();

  const getPageIndexParam = searchParams.get("pageIndex");
  const getPageSizeParam = searchParams.get("pageSize");

  const [changePeriod, setChangePeriod] = useState(false);

  const [openModal, setOpenModal] = useState(false);
  const [
    selectedStudentCourseAttendanceToDelete,
    setSelectedStudentCourseAttendanceToDelete,
  ] = useState<StudentCourseAttendancesByDay | null>(null);

  const closeModal = () => {
    setOpenModal(false);
    setSelectedStudentCourseAttendanceToDelete(null);
  };

  const columns = useMemo<
    ColumnDef<StudentCourseAttendancesByDayViewModel, any>[]
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
            {row.original.Attendances.length > 0 && row.getCanExpand() ? (
              <div onClick={row.getToggleExpandedHandler()}>
                {row.getIsExpanded() ? (
                  <Icon name="MdArrowDownward" className="cursor-pointer" />
                ) : (
                  <Icon name="MdArrowForward" className="cursor-pointer" />
                )}
              </div>
            ) : (
              <Icon name="MdHorizontalRule" />
            )}
          </div>
        ),
        size: 5,
      },
      {
        accessorKey: "LevelName",
        id: "LevelName",
        header: () => (
          <Header text={t.studentCourseAttendances.columnsByDay.levelName} />
        ),
        filterFn: "equalsString",
      },
    ],
    [],
  );

  const columnsExtended = useMemo<
    ColumnDef<StudentCourseAttendancesByDay, any>[]
  >(
    () => [
      {
        accessorKey: "CourseCode",
        id: "CourseCode",
        header: () => (
          <Header
            text={t.studentCourseAttendances.columnsByDayExtended.courseCode}
          />
        ),
        filterFn: "equalsString",
        cell: (row) =>
          row.getValue().includes("/")
            ? row.getValue().slice(0, -2)
            : row.getValue(),
        size: 100,
      },
      {
        accessorKey: "CourseName",
        id: "CourseName",
        header: () => (
          <Header
            text={t.studentCourseAttendances.columnsByDayExtended.courseName}
          />
        ),
        filterFn: "equalsString",
        size: 400,
      },
      {
        accessorKey: "AttendancePeriod",
        id: "AttendancePeriod",
        header: () => (
          <Header
            text={
              t.studentCourseAttendances.columnsByDayExtended.attendancePeriod
            }
          />
        ),
        cell: ({ row }) => <span>{`P${row.original.AttendancePeriod}`}</span>,
        filterFn: "equalsString",
      },
      {
        accessorKey: "UserName",
        id: "UserName",
        header: () => (
          <Header
            text={t.studentCourseAttendances.columnsByDayExtended.teacher}
          />
        ),
        filterFn: "equalsString",
      },
      {
        accessorKey: "actions",
        id: "actions",
        header: () => <Header text={t.shared.actions} />,
        size: 50,
        cell: ({ row }) => (
          <div
            className="flex space-x-1"
            onClick={(event) => event.stopPropagation()}
          >
            <Icon
              name="MdEdit"
              className="cursor-pointer text-xl hover:text-primary"
              onClick={
                () =>
                  router.push(
                    `/courses/studentCourseAttendances/${row.original.CourseId}?action="edit"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&courseId=${row.original.CourseId}&attendanceDate=${row.original.AttendanceDate.toUTCString()}${scholarPeriodSelected !== 0 ? `&scholarPeriodId=${scholarPeriodSelected}` : ""}&AttendancePeriod=${row.original.AttendancePeriod}&tab=${tabValue}`,
                  )
                // router.push(
                //   `/courses/studentCourseAttendances/${row.original.CourseId}?action="edit"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&courseId=${row.original.CourseId}&periodNumber=${periodNumberSelected}&attendanceDate=${row.original.AttendanceDate.toUTCString()}${scholarPeriodSelected !== 0 ? `&scholarPeriodId=${scholarPeriodSelected}` : ""}&AttendancePeriod=${row.original.AttendancePeriod}&tab=${tabValue}`,
                // )
              }
            />
            <Icon
              name="MdDelete"
              className="cursor-pointer text-xl text-primary hover:text-destructive"
              onClick={() => {
                setOpenModal(true);
                setSelectedStudentCourseAttendanceToDelete(row.original);
              }}
            />
          </div>
        ),
      },
    ],
    [getPageIndexParam, getPageSizeParam],
    // [getPageIndexParam, getPageSizeParam, periodNumberSelected],
  );

  const deleteStudentCourseAttendance = async (
    studentCourseAttendance: StudentCourseAttendancesByDay,
  ) => {
    try {
      const studentCourseAttendanceToDelete = {
        CourseId: studentCourseAttendance.CourseId,
        AttendanceDate: studentCourseAttendance.AttendanceDate,
        AttendancePeriod: studentCourseAttendance.AttendancePeriod,
      };
      const response = await deleteStudentCourseAttendanceCommand(
        studentCourseAttendanceToDelete,
      );

      if (!response) {
        throw new Error(
          `${t.studentCourseAttendances.notifications.deleteFailure}`,
        );
      }
      toast({
        title: `${t.studentCourseAttendances.notifications.deleteSuccess}`,
        description: `${t.studentCourseAttendances.title} : ${studentCourseAttendance.CourseName} - ${formatDate(studentCourseAttendance.AttendanceDate)} - P${studentCourseAttendance.AttendancePeriod}`,
      });
      router.refresh();
      closeModal();
    } catch (error) {
      toast({
        variant: "destructive",
        title: `${t.studentCourseAttendances.notifications.deleteError}`,
        description: `${error}`,
      });
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

  const subtractDays = (date: Date, days: number) => {
    date.setDate(date.getDate() - days);
    return date;
  };

  return (
    <div>
      <div className="mt-5">
        <div className="flex items-center justify-between space-x-5">
          <div className="flex justify-end space-x-3 overflow-hidden">
            {[...Array(7)].map((_, i) => (
              <Button
                key={i}
                variant={
                  formatDate(subtractDays(new Date(), 6 - i)) ===
                  formatDate(selectedAttendanceDate)
                    ? "default"
                    : "outlineColored"
                }
                className=" "
                onClick={() =>
                  handleUrlParameterChange(
                    "attendanceDate",
                    `${subtractDays(new Date(), 6 - i).toISOString()}`,
                  )
                }
              >
                <span>{formatDate(subtractDays(new Date(), 6 - i))}</span>
              </Button>
            ))}
            <div className="w-auto min-w-40">
              <CalendarInput
                variant="outlineColored"
                dateValue={selectedAttendanceDate}
                setDateValue={(x: Date) => {
                  handleUrlParameterChange("attendanceDate", `${x}`);
                }}
              />
            </div>
            {/* <Button
              variant={changePeriod ? "default" : "outlineColored"}
              onClick={() => setChangePeriod(!changePeriod)}
            >
              <span>{t.studentCourseAttendances.changePeriod}</span>
            </Button> */}
          </div>
          <Button
            variant="outlineColored"
            onClick={
              () =>
                router.push(
                  `/courses/studentCourseAttendances/create?action="create"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&courseId=${courseIdSelected}d&attendanceDate=${selectedAttendanceDate}${scholarPeriodSelected !== 0 ? `&scholarPeriodId=${scholarPeriodSelected}` : ""}&tab=${tabValue}`,
                )
              // router.push(
              //   `/courses/studentCourseAttendances/create?action="create"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&courseId=${courseIdSelected}&periodNumber=${periodNumberSelected}&attendanceDate=${selectedAttendanceDate}${scholarPeriodSelected !== 0 ? `&scholarPeriodId=${scholarPeriodSelected}` : ""}&tab=${tabValue}`,
              // )
            }
          >
            <span>{t.studentCourseAttendances.create}</span>
          </Button>
        </div>
        {/* {changePeriod ? (
          <>
            <div className="mt-5">
              <div className="flex items-center justify-between space-x-5">
                <div className="w-[15rem]">
                  <Combobox
                    options={scholarPeriods}
                    textAttribute="Name"
                    valueAttribute="ScholarPeriodId"
                    placeholder={
                      t.studentCourseAttendances.filters.scholarPeriodId
                    }
                    itemSelected={scholarPeriods.find(
                      (x) => x.ScholarPeriodId === scholarPeriodSelected,
                    )}
                    setItemSelected={(x: ScholarPeriodsViewModel) => {
                      handleUrlParameterChange(
                        "scholarPeriodId",
                        `${x.ScholarPeriodId}`,
                      );
                      handleUrlParameterChange("courseId", `0`);
                    }}
                    notClearable
                  />
                </div>
              </div>
            </div>
          </>
        ) : (
          <></>
        )} */}
      </div>
      <Table
        columns={columns}
        data={attendancesData}
        className=""
        pageIndexParam={pageIndex}
        pageSizeParam={pageSize}
        expandable
        expandedContent={(row) => (
          <Table
            columns={columnsExtended}
            data={row.Attendances}
            onRowClick={
              (row) =>
                router.push(
                  `/courses/studentCourseAttendances/${row.CourseId}?action="view"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&courseId=${row.CourseId}&attendanceDate=${row.AttendanceDate.toUTCString()}${scholarPeriodSelected !== 0 ? `&scholarPeriodId=${scholarPeriodSelected}` : ""}&AttendancePeriod=${row.AttendancePeriod}&tab=${tabValue}`,
                )
              // router.push(
              //   `/courses/studentCourseAttendances/${row.CourseId}?action="view"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&courseId=${row.CourseId}&periodNumber=${periodNumberSelected}&attendanceDate=${row.AttendanceDate.toUTCString()}${scholarPeriodSelected !== 0 ? `&scholarPeriodId=${scholarPeriodSelected}` : ""}&AttendancePeriod=${row.AttendancePeriod}&tab=${tabValue}`,
              // )
            }
            pageSizeParam={row.Attendances.length}
            minimalMode
            noBorders
          />
        )}
      />
      <DeleteModal
        openModal={openModal}
        closeModal={closeModal}
        titleText={t.studentCourseAttendances.deleteModal.title}
        descriptionText={t.studentCourseAttendances.deleteModal.description}
        deletefunction={() =>
          selectedStudentCourseAttendanceToDelete &&
          deleteStudentCourseAttendance(selectedStudentCourseAttendanceToDelete)
        }
      />
    </div>
  );
}
