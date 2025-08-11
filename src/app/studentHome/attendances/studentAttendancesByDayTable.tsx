"use client";

import { useMemo } from "react";
import { StudentCourseAttendancesByDayAndStudentIdViewModel } from "@/repositories/studentCourseAttendances/StudentCourseAttendancesViewModel";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import CalendarInput from "@/components/common/calendarInput";
import { Button } from "@/components/ui/button";
import { attendanceValueEnum } from "@/enum/attendanceValueEnum";
import formatDate from "@/functions/formatDate";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";

import frFR from "@/lang/fr-FR";

export default function StudentAttendancesByDayTable({
  attendancesData,
  selectedAttendanceDate,
  urlParams,
}: {
  attendancesData: StudentCourseAttendancesByDayAndStudentIdViewModel[];
  selectedAttendanceDate: Date;
  periodNumberSelected: number;
  tabValue: string;
  pageIndex: number;
  pageSize: number;
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const updateQuery = useUpdateQuery();

  const columns = useMemo<
    ColumnDef<StudentCourseAttendancesByDayAndStudentIdViewModel, any>[]
  >(
    () => [
      {
        accessorKey: "CourseCode",
        id: "CourseCode",
        header: () => (
          <Header text={t.studentAttendances.columnsByDay.courseCode} />
        ),
        filterFn: "equalsString",
        size: 100,
      },
      {
        accessorKey: "CourseName",
        id: "CourseName",
        header: () => (
          <Header text={t.studentAttendances.columnsByDay.courseName} />
        ),
        filterFn: "equalsString",
        size: 400,
      },
      {
        accessorKey: "AttendanceDate",
        id: "AttendanceDate",
        header: () => (
          <Header text={t.studentAttendances.columnsByDay.attendanceDate} />
        ),
        cell: ({ row }) => (
          <span>{formatDate(row.original.AttendanceDate)}</span>
        ),
        filterFn: "equalsString",
      },
      {
        accessorKey: "AttendancePeriod",
        id: "AttendancePeriod",
        header: () => (
          <Header text={t.studentAttendances.columnsByDay.attendancePeriod} />
        ),
        cell: ({ row }) => <span>{`P${row.original.AttendancePeriod}`}</span>,
        filterFn: "equalsString",
      },
      {
        accessorKey: "UserName",
        id: "UserName",
        header: () => (
          <Header text={t.studentAttendances.columnsByDay.userName} />
        ),
        filterFn: "equalsString",
      },
      {
        accessorKey: "AttendanceValue",
        id: "AttendanceValue",
        header: () => (
          <Header text={t.studentAttendances.columnsByDay.attendanceValue} />
        ),
        cell: ({ row }) => (
          <span
            className={`${row.original.AttendanceValue === attendanceValueEnum.Présent ? "text-green-600" : row.original.AttendanceValue === attendanceValueEnum.Absent ? "text-red-600" : row.original.AttendanceValue === attendanceValueEnum.Retard ? "text-yellow-600" : ""}`}
          >
            {attendanceValueEnum[row.original.AttendanceValue]}
          </span>
        ),
        filterFn: "equalsString",
      },
    ],
    [],
  );

  const mobileColumns = useMemo<
    ColumnDef<StudentCourseAttendancesByDayAndStudentIdViewModel, any>[]
  >(
    () => [
      {
        accessorKey: "",
        id: "1",
        header: () => (
          <div className="w-full">
            <Header text={t.studentAttendances.columnsByCourse.courseName} />
          </div>
        ),
        cell: ({ row }) => (
          <div>
            <div>
              <span className="text-sm font-semibold">
                {row.original.CourseName}
              </span>
            </div>

            <div className="flex space-x-5">
              <div>
                <span className="text-xs font-semibold">{`${t.studentAttendances.columnsByCourse.courseCode.toUpperCase()}: `}</span>
                <span className="text-xs">{row.original.CourseCode}</span>
              </div>
              <div>
                <span className="text-xs font-semibold">{`${t.studentAttendances.columnsByCourseExtended.userName.toUpperCase()}: `}</span>
                <span className="text-xs">{row.original.UserName}</span>
              </div>
            </div>
            <div className="flex space-x-5">
              <div>
                <span className="text-xs font-semibold">{`${t.studentAttendances.columnsByCourseExtended.attendanceDate.toUpperCase()}: `}</span>
                <span className="text-xs text-primary">
                  {formatDate(row.original.AttendanceDate)}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold">{`${t.studentAttendances.columnsByCourseExtended.attendancePeriod.toUpperCase()}: `}</span>
                <span className="text-xs font-semibold text-primary">
                  {`P${row.original.AttendancePeriod}`}
                </span>
              </div>
              <div>
                <span className="text-xs font-semibold">{`${t.studentAttendances.columnsByCourseExtended.attendanceValue.toUpperCase()}: `}</span>
                <span
                  className={`text-xs ${row.original.AttendanceValue === attendanceValueEnum.Présent ? "text-green-600" : row.original.AttendanceValue === attendanceValueEnum.Absent ? "text-red-600" : row.original.AttendanceValue === attendanceValueEnum.Retard ? "text-yellow-600" : ""}`}
                >
                  {attendanceValueEnum[row.original.AttendanceValue]}
                </span>
              </div>
            </div>
          </div>
        ),
      },
    ],
    [],
  );

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
    <>
      {/* Desktop */}
      <div className="hidden sm:mt-5 sm:block">
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
          </div>
        </div>
        <Table
          columns={columns}
          data={attendancesData}
          className=""
          expandable
        />
      </div>
      {/* Mobile */}
      <div className="mt-5 sm:hidden">
        {/* <div className="w-auto min-w-40">
          <CalendarInput
            variant="outlineColored"
            dateValue={selectedAttendanceDate}
            setDateValue={(x: Date) => {
              handleUrlParameterChange("attendanceDate", `${x}`);
            }}
          />
        </div> */}

        <div className="flex justify-center space-x-3 overflow-hidden">
          {[...Array(4)].map((_, i) => (
            <Button
              key={i}
              variant={
                formatDate(subtractDays(new Date(), 3 - i)) ===
                formatDate(selectedAttendanceDate)
                  ? "default"
                  : "outlineColored"
              }
              size={"sm"}
              className=""
              onClick={() =>
                handleUrlParameterChange(
                  "attendanceDate",
                  `${subtractDays(new Date(), 3 - i).toISOString()}`,
                )
              }
            >
              <span className="text-xs">
                {formatDate(subtractDays(new Date(), 3 - i))}
              </span>
            </Button>
          ))}
        </div>
        <div className="mt-3 w-auto min-w-40">
          <CalendarInput
            variant="outlineColored"
            dateValue={selectedAttendanceDate}
            setDateValue={(x: Date) => {
              handleUrlParameterChange("attendanceDate", `${x}`);
            }}
          />
        </div>

        <div className="mt-3">
          <Table
            columns={mobileColumns}
            data={attendancesData}
            expandable
            minimalMode
          />
        </div>
      </div>
      {/* <pre>{JSON.stringify(attendancesData, null, 2)}</pre> */}
    </>
  );
}
