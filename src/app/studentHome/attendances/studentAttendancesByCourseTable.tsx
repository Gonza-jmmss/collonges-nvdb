"use client";

import { useMemo } from "react";
import {
  StudentCourseAttendancesByCourseAndStudentIdViewModel,
  StudentCourseAttendancesByCourseAndStudentId,
} from "@/repositories/studentCourseAttendances/StudentCourseAttendancesViewModel";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import Icon from "@/components/common/icon";
import { AttendanceValueEnum } from "@/enum/attendanceValueEnum";
import formatDate from "@/functions/formatDate";
import { useSearchParams } from "next/navigation";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";

import frFR from "@/lang/fr-FR";

export default function StudentAttendancesByCourseTable({
  attendancesData,
  urlParams,
}: {
  attendancesData: StudentCourseAttendancesByCourseAndStudentIdViewModel[];
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const updateQuery = useUpdateQuery();
  const searchParams = useSearchParams();

  const columns = useMemo<
    ColumnDef<StudentCourseAttendancesByCourseAndStudentIdViewModel, any>[]
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
        accessorKey: "CourseCode",
        id: "CourseCode",
        header: () => (
          <Header text={t.studentAttendances.columnsByCourse.courseCode} />
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
          <Header text={t.studentAttendances.columnsByCourse.courseName} />
        ),
        filterFn: "equalsString",
        size: 400,
      },
      {
        accessorKey: "AttendanceScore",
        id: "AttendanceScore",
        header: () => (
          <Header text={t.studentAttendances.columnsByCourse.attendanceScore} />
        ),
        filterFn: "equalsString",
      },
    ],
    [],
  );

  const columnsExtended = useMemo<
    ColumnDef<StudentCourseAttendancesByCourseAndStudentId, any>[]
  >(
    () => [
      {
        accessorKey: "AttendanceDate",
        id: "AttendanceDate",
        header: () => (
          <Header
            text={t.studentAttendances.columnsByCourseExtended.attendanceDate}
          />
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
          <Header
            text={t.studentAttendances.columnsByCourseExtended.attendancePeriod}
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
            text={t.studentAttendances.columnsByCourseExtended.userName}
          />
        ),
        filterFn: "equalsString",
      },
      {
        accessorKey: "AttendanceValue",
        id: "AttendanceValue",
        header: () => (
          <Header
            text={t.studentAttendances.columnsByCourseExtended.attendanceValue}
          />
        ),
        cell: ({ row }) => (
          <span
            className={`${row.original.AttendanceValue === AttendanceValueEnum.Présent ? "text-green-600" : row.original.AttendanceValue === AttendanceValueEnum.Absent ? "text-red-600" : row.original.AttendanceValue === AttendanceValueEnum.Retard ? "text-yellow-600" : ""}`}
          >
            {AttendanceValueEnum[row.original.AttendanceValue]}
          </span>
        ),
        filterFn: "equalsString",
      },
    ],
    [],
  );

  const mobileColumns = useMemo<
    ColumnDef<StudentCourseAttendancesByCourseAndStudentIdViewModel, any>[]
  >(
    () => [
      {
        accessorKey: "",
        id: "1",
        header: () => <Header text={t.studentProfile.columns.courseName} />,
        cell: ({ row }) => (
          <div
            style={{
              paddingLeft: `${row.depth * 2}rem`,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            <div
              className="flex items-center space-x-3"
              onClick={row.getToggleExpandedHandler()}
            >
              {row.original.Attendances.length > 0 && row.getCanExpand() ? (
                <Icon
                  name={`${row.getIsExpanded() ? "MdArrowDownward" : "MdArrowForward"}`}
                  className="cursor-pointer"
                />
              ) : (
                <Icon name="MdHorizontalRule" />
              )}
              <div>
                <div>
                  <span className="text-sm font-semibold">
                    {row.original.CourseName}
                  </span>
                </div>
                <div className="flex space-x-5">
                  <div>
                    <span className="text-xs font-semibold">{`${t.studentAttendances.columnsByCourse.courseCode.toUpperCase()}: `}</span>
                    <span className="text-xs">
                      {row.original.CourseCode &&
                      row.original.CourseCode.includes("/")
                        ? row.original.CourseCode.slice(0, -2)
                        : row.original.CourseCode}
                    </span>
                  </div>
                  <div>
                    <span className="text-xs font-semibold">{`${t.studentAttendances.columnsByCourse.attendanceScore.toUpperCase()}: `}</span>
                    <span className="text-xs font-semibold text-primary">
                      {row.original.AttendanceScore}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
      },
    ],
    [],
  );

  const mobileColumnsExtended = useMemo<
    ColumnDef<StudentCourseAttendancesByCourseAndStudentId, any>[]
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
                  className={`text-xs ${row.original.AttendanceValue === AttendanceValueEnum.Présent ? "text-green-600" : row.original.AttendanceValue === AttendanceValueEnum.Absent ? "text-red-600" : row.original.AttendanceValue === AttendanceValueEnum.Retard ? "text-yellow-600" : ""}`}
                >
                  {AttendanceValueEnum[row.original.AttendanceValue]}
                </span>
              </div>
            </div>
            <div className="flex space-x-5">
              <div>
                <span className="text-xs font-semibold">{`${t.studentAttendances.columnsByCourseExtended.userName.toUpperCase()}: `}</span>
                <span className="text-xs">{row.original.UserName}</span>
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
        <div className="mt-3">
          <Table
            columns={columns}
            data={attendancesData}
            expandable
            expandedContent={(row) => (
              <Table
                columns={columnsExtended}
                data={row.Attendances}
                pageSizeParam={row.Attendances.length}
                minimalMode
                noBorders
              />
            )}
          />
        </div>
      </div>
      {/* Mobile */}
      <div className="mt-5 sm:hidden">
        <div className="mt-3">
          <Table
            columns={mobileColumns}
            data={attendancesData}
            expandable
            minimalMode
            expandedContent={(row) => (
              <Table
                columns={mobileColumnsExtended}
                data={row.Attendances}
                pageSizeParam={row.Attendances.length}
                minimalMode
                noBorders
              />
            )}
          />
        </div>
      </div>
      {/* <pre>{JSON.stringify(attendancesData, null, 2)}</pre> */}
    </>
  );
}
