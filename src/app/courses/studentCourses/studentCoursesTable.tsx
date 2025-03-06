"use client";

import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/common/combobox";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import {
  StudentCoursesViewModel,
  StudentCoursesExtendedViewModel,
} from "@/repositories/studentCourses/studentCoursesViewModel";
import { ScholarYearsViewModel } from "@/repositories/scholarYears/scholarYearsViewModel";
import { ScholarPeriodsViewModel } from "@/repositories/scholarPeriods/scholarPeriodsViewModel";
import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function StudentCoursesTable({
  studentCoursesData,
  scholarYears,
  scholarPeriods,
  urlParams,
}: {
  studentCoursesData: StudentCoursesViewModel[];
  scholarYears: ScholarYearsViewModel[];
  scholarPeriods: ScholarPeriodsViewModel[];
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const router = useRouter();
  const updateQuery = useUpdateQuery();

  const [expandedContent, setExpandedContent] = useState<React.ReactNode>();

  const [scholarYearFilter, setScholarYearFilter] =
    useState<ScholarYearsViewModel>(
      typeof urlParams?.scholarYear === "string"
        ? scholarYears[parseInt(urlParams?.scholarYear)]
        : scholarYears[0],
    );

  const [scholarPeriodFilter, setScholarPeriodFilter] =
    useState<ScholarPeriodsViewModel>(
      typeof urlParams?.scholarPeriod === "string"
        ? scholarPeriods[parseInt(urlParams?.scholarPeriod)]
        : scholarPeriods[0],
    );

  const columns = useMemo<ColumnDef<StudentCoursesViewModel, any>[]>(
    () => [
      {
        accessorKey: "StudentId",
        id: "StudentId",
        header: () => <Header text="" />,
        cell: ({ row }) => (
          <div
            style={{
              paddingLeft: `${row.depth * 2}rem`,
            }}
            onClick={(event) => event.stopPropagation()}
          >
            {row.original.StudentCourses.length > 0 && row.getCanExpand() ? (
              <div onClick={row.getToggleExpandedHandler()}>
                {row.getIsExpanded() ? (
                  <Icon
                    name={
                      isValidIconName("MdArrowDownward")
                        ? "MdArrowDownward"
                        : "MdOutlineNotInterested"
                    }
                    className="cursor-pointer"
                    onClick={() => handleRowClick(null)}
                  />
                ) : (
                  <Icon
                    name={
                      isValidIconName("MdArrowForward")
                        ? "MdArrowForward"
                        : "MdOutlineNotInterested"
                    }
                    className="cursor-pointer"
                    onClick={() => handleRowClick(row.original)}
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
      // {
      //   accessorKey: "StudentId",
      //   id: "StudentId",
      //   header: () => <Header text={t.studentCourses.columns.studentId} />,
      //   filterFn: "equalsString",
      //   // cell: ({ row, getValue }) => (
      //   //   <div
      //   //     style={{
      //   //       paddingLeft: `${row.depth * 2}rem`,
      //   //     }}
      //   //   >
      //   //     <div className="flex items-center space-x-2">
      //   //       {row.getCanExpand() ? (
      //   //         <div onClick={row.getToggleExpandedHandler()}>
      //   //           {row.getIsExpanded() ? (
      //   //             <Icon
      //   //               name={
      //   //                 isValidIconName("MdArrowDownward")
      //   //                   ? "MdArrowDownward"
      //   //                   : "MdOutlineNotInterested"
      //   //               }
      //   //               onClick={() => handleRowClick(null)}
      //   //             />
      //   //           ) : (
      //   //             <Icon
      //   //               name={
      //   //                 isValidIconName("MdArrowForward")
      //   //                   ? "MdArrowForward"
      //   //                   : "MdOutlineNotInterested"
      //   //               }
      //   //               onClick={() => handleRowClick(row.original)}
      //   //             />
      //   //           )}
      //   //         </div>
      //   //       ) : (
      //   //         <Icon
      //   //   name={
      //   //     isValidIconName("MdHorizontalRule")
      //   //       ? "MdHorizontalRule"
      //   //       : "MdOutlineNotInterested"
      //   //   }
      //   // />
      //   //       )}
      //   //       <div>{getValue<boolean>()}</div>
      //   //     </div>
      //   //   </div>
      //   // ),
      // },
      {
        accessorKey: "AlternativeName",
        id: "AlternativeName",
        header: () => (
          <Header text={t.studentCourses.columns.alternativeName} />
        ),
        filterFn: "equalsString",
      },
      {
        accessorKey: "IsEnabled",
        id: "IsEnabled",
        cell: (x) => (x.getValue() == 1 ? t.shared.yes : t.shared.no),
        header: () => <Header text={t.studentCourses.columns.isEnabled} />,
        filterFn: "includesStringSensitive",
        size: 10,
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
            {row.row.original.IsEnabled && (
              <Icon
                name={
                  isValidIconName("MdEdit")
                    ? "MdEdit"
                    : "MdOutlineNotInterested"
                }
                className="cursor-pointer text-xl hover:text-primary"
                onClick={() =>
                  router.push(
                    `/courses/studentCourses/${row.row.original.StudentId}?action="edit"${scholarPeriodFilter.ScholarPeriodId !== 0 ? `&scholarPeriod=${scholarPeriodFilter.ScholarPeriodId}` : ""}`,
                  )
                }
              />
            )}
          </div>
        ),
      },
    ],
    [scholarPeriodFilter.ScholarPeriodId],
  );

  const columnsExtended = useMemo<
    ColumnDef<StudentCoursesExtendedViewModel, any>[]
  >(
    () => [
      {
        accessorKey: "Name",
        id: "Name",
        header: () => <Header text={t.studentCourses.columns.name} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "CourseCode",
        id: "CourseCode",
        header: () => <Header text={t.studentCourses.columns.courseCode} />,
        filterFn: "equalsString",
        size: 30,
      },
      {
        accessorKey: "ScholarPeriodName",
        id: "ScholarPeriodName",
        header: () => (
          <Header text={t.studentCourses.columns.scholarPeriodId} />
        ),
        filterFn: "equalsString",
        size: 30,
      },
      {
        accessorKey: "Note",
        id: "Note",
        header: () => <Header text={t.studentCourses.columns.note} />,
        filterFn: "equalsString",
        size: 30,
      },
    ],
    [],
  );

  const handleRowClick = (row: StudentCoursesViewModel | null) => {
    if (row !== null)
      setExpandedContent(
        <Table
          columns={columnsExtended}
          data={row.StudentCourses}
          minimalMode
          noBorders
        />,
      );
  };

  const handleUrlParameterChange = (key: string, value: string) => {
    const currentParams = new URLSearchParams();
    Object.entries(urlParams || {}).forEach(([k, v]) => {
      if (typeof v === "string") {
        currentParams.set(k, v);
      }
    });
    currentParams.set(key, value);
    updateQuery(Object.fromEntries(currentParams));
  };

  return (
    <div>
      <div className="flex items-center justify-end space-x-5">
        <div className="w-[15rem]">
          <Combobox
            options={scholarYears}
            textAttribute="Name"
            valueAttribute="ScholarYearId"
            placeholder={t.courses.form.periodNumber}
            itemSelected={scholarYears.find(
              (x) => x.ScholarYearId === scholarYearFilter.ScholarYearId,
            )}
            setItemSelected={(x: ScholarYearsViewModel) => {
              setScholarYearFilter(x && x);
              handleUrlParameterChange("scholarYear", `${x.ScholarYearId}`);
            }}
            notClearable
          />
        </div>
        <div className="w-[15rem]">
          <Combobox
            options={scholarPeriods}
            textAttribute="Name"
            valueAttribute="ScholarPeriodId"
            placeholder={t.courses.form.periodNumber}
            itemSelected={scholarPeriods.find(
              (x) => x.ScholarPeriodId === scholarPeriodFilter.ScholarPeriodId,
            )}
            setItemSelected={(x: ScholarPeriodsViewModel) => {
              setScholarPeriodFilter(x && x);
              handleUrlParameterChange("scholarPeriod", `${x.ScholarPeriodId}`);
            }}
            notClearable
          />
        </div>
        <Button
          variant="outlineColored"
          onClick={() =>
            router.push(
              `/courses/studentCourses/create?action="create"${scholarPeriodFilter ? `&scholarPeriod=${scholarPeriodFilter.ScholarPeriodId}` : ""}`,
            )
          }
        >
          <span>{t.courses.create}</span>
        </Button>
      </div>
      <Table
        columns={columns}
        data={studentCoursesData}
        className=""
        expandable
        expandedContent={expandedContent}
      />
    </div>
  );
}
