"use client";

import { useMemo } from "react";
import {
  StudentCourseAttendancesByStudentViewModel,
  StudentCourseAttendancesByStudent,
} from "@/repositories/studentCourseAttendances/StudentCourseAttendancesViewModel";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import Icon from "@/components/common/icon";
import frFR from "@/lang/fr-FR";

export default function AttendancesByStudentTable({
  attendancesData,
  periodNumberSelected,
  tabValue,
  pageIndex,
  pageSize,
  urlParams,
}: {
  attendancesData: StudentCourseAttendancesByStudentViewModel[];
  periodNumberSelected: number;
  tabValue: string;
  pageIndex: number;
  pageSize: number;
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;

  const columns = useMemo<
    ColumnDef<StudentCourseAttendancesByStudentViewModel, any>[]
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
        accessorKey: "StudentName",
        id: "StudentName",
        header: () => (
          <Header
            text={t.studentCourseAttendances.columnsByStudent.studentName}
          />
        ),
        filterFn: "equalsString",
      },
    ],
    [],
  );

  const columnsExtended = useMemo<
    ColumnDef<StudentCourseAttendancesByStudent, any>[]
  >(
    () => [
      {
        accessorKey: "CourseCode",
        id: "CourseCode",
        header: () => (
          <Header
            text={
              t.studentCourseAttendances.columnsByStudentExtended.courseCode
            }
          />
        ),
        filterFn: "equalsString",
        size: 100,
      },
      {
        accessorKey: "CourseName",
        id: "CourseName",
        header: () => (
          <Header
            text={
              t.studentCourseAttendances.columnsByStudentExtended.courseName
            }
          />
        ),
        filterFn: "equalsString",
        size: 400,
      },
      {
        accessorKey: "AttendanceScore",
        id: "AttendanceScore",
        header: () => (
          <Header
            text={
              t.studentCourseAttendances.columnsByStudentExtended
                .attendanceScore
            }
          />
        ),
        filterFn: "equalsString",
      },
    ],
    [],
  );

  return (
    <div>
      <div className="mt-5">
        <div className="flex items-center justify-between space-x-5"></div>
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
            minimalMode
            noBorders
          />
        )}
      />
    </div>
  );
}
