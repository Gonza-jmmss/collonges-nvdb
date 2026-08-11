"use client";

import { useState, useMemo } from "react";
import {
  StudentCourseAttendancesByStudentViewModel,
  StudentCourseAttendancesByStudent,
} from "@/repositories/studentCourseAttendances/StudentCourseAttendancesViewModel";
import { ScholarPeriodsViewModel } from "@/repositories/scholarPeriods/scholarPeriodsViewModel";
import Combobox from "@/components/common/combobox";
import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import Icon from "@/components/common/icon";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import frFR from "@/lang/fr-FR";

export default function AttendancesByStudentTable({
  attendancesData,
  // periodNumberSelected,
  scholarPeriods,
  scholarPeriodSelected,
  tabValue,
  pageIndex,
  pageSize,
  urlParams,
}: {
  attendancesData: StudentCourseAttendancesByStudentViewModel[];
  // periodNumberSelected: number;
  scholarPeriods: ScholarPeriodsViewModel[];
  scholarPeriodSelected: number;
  tabValue: string;
  pageIndex: number;
  pageSize: number;
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const updateQuery = useUpdateQuery();

  const [changePeriod, setChangePeriod] = useState(false);

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

  const handleUrlParameterChange = (key: string, value: string) => {
    const currentParams = new URLSearchParams(window.location.search);
    currentParams.set(key, value);

    // Update URL without replacing current parameters
    const newUrl = `${window.location.pathname}?${currentParams.toString()}`;

    window.history.pushState({}, "", newUrl);

    // If you need to update some state as well
    updateQuery(Object.fromEntries(currentParams));
  };

  return (
    <div>
      <div className="mt-5">
        <div className="flex items-center justify-between space-x-5"></div>
      </div>
      <div className="-ml-3 flex flex-wrap justify-start space-x-3 space-y-3 xl:flex-row xl:items-center xl:space-y-0">
        <div />
        <Button
          variant={changePeriod ? "default" : "outlineColored"}
          onClick={() => setChangePeriod(!changePeriod)}
        >
          <span>{t.studentCourseAttendances.changePeriod}</span>
        </Button>
        {changePeriod ? (
          <>
            <div className="w-[15rem]">
              <Combobox
                options={scholarPeriods}
                textAttribute="Name"
                valueAttribute="ScholarPeriodId"
                placeholder={t.studentCourseAttendances.filters.scholarPeriodId}
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
          </>
        ) : (
          <></>
        )}
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
            pageSizeParam={row.Attendances.length}
            minimalMode
            noBorders
          />
        )}
      />
    </div>
  );
}
