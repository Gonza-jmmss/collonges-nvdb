"use client";

import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import { Button } from "@/components/ui/button";
import Combobox from "@/components/common/combobox";
import Icon from "@/components/common/icon";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import {
  StudentCoursesViewModel,
  StudentCoursesExtendedViewModel,
} from "@/repositories/studentCourses/studentCoursesViewModel";
import { ScholarYearsViewModel } from "@/repositories/scholarYears/scholarYearsViewModel";
import { ScholarPeriodsViewModel } from "@/repositories/scholarPeriods/scholarPeriodsViewModel";
import { useRouter, useSearchParams } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function StudentCoursesTable({
  studentCoursesData,
  scholarYearSelected,
  scholarYears,
  scholarPeriodSelected,
  scholarPeriods,
  pageIndex,
  pageSize,
  urlParams,
}: {
  studentCoursesData: StudentCoursesViewModel[];
  scholarYearSelected: number;
  scholarYears: ScholarYearsViewModel[];
  scholarPeriodSelected: number;
  scholarPeriods: ScholarPeriodsViewModel[];
  pageIndex: number;
  pageSize: number;
  urlParams: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const router = useRouter();
  const updateQuery = useUpdateQuery();
  const searchParams = useSearchParams();

  const getPageIndexParam = searchParams.get("pageIndex");
  const getPageSizeParam = searchParams.get("pageSize");

  const columns = useMemo<ColumnDef<StudentCoursesViewModel, any>[]>(
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
            {row.original.StudentCourses.length > 0 && row.getCanExpand() ? (
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
        accessorKey: "",
        id: "2",
        header: () => <Header text={t.studentCourses.columns.coursesAsigned} />,
        filterFn: "equalsString",
        cell: ({ row }) => <span>{row.original.StudentCourses.length}</span>,
        size: 20,
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
            {row.row.original.IsEnabled && scholarPeriodSelected !== 0 && (
              <Icon
                name="MdEdit"
                className="cursor-pointer text-xl hover:text-primary"
                onClick={() =>
                  router.push(
                    `/courses/studentCourses/${row.row.original.StudentId}?action="edit"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}${scholarPeriodSelected !== 0 ? `&scholarPeriodId=${scholarPeriodSelected}` : ""}&scholarYearId=${scholarYearSelected}`,
                  )
                }
              />
            )}
          </div>
        ),
      },
    ],
    [
      scholarPeriodSelected,
      scholarYearSelected,
      getPageIndexParam,
      getPageSizeParam,
    ],
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
      <div className="flex items-center justify-end space-x-5">
        <div className="w-[15rem]">
          <Combobox
            options={scholarYears}
            textAttribute="Name"
            valueAttribute="ScholarYearId"
            placeholder={t.courses.form.periodNumber}
            itemSelected={scholarYears.find(
              (x) => x.ScholarYearId === scholarYearSelected,
            )}
            setItemSelected={(x: ScholarYearsViewModel) => {
              handleUrlParameterChange("scholarYearId", `${x.ScholarYearId}`);
              handleUrlParameterChange("scholarPeriodId", `${null}`);
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
              (x) => x.ScholarPeriodId === scholarPeriodSelected,
            )}
            setItemSelected={(x: ScholarPeriodsViewModel) => {
              handleUrlParameterChange(
                "scholarPeriodId",
                `${x.ScholarPeriodId}`,
              );
            }}
            notClearable
          />
        </div>
        <Button
          variant="outlineColored"
          onClick={() =>
            router.push(
              `/courses/studentCourses/create?action="create"&pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}${scholarPeriodSelected ? `&scholarPeriodId=${scholarPeriodSelected}` : ""}&scholarYearId=${scholarYearSelected}`,
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
        pageIndexParam={pageIndex}
        pageSizeParam={pageSize}
        expandable
        expandedContent={(row) => (
          <Table
            columns={columnsExtended}
            data={row.StudentCourses}
            minimalMode
            noBorders
          />
        )}
      />
    </div>
  );
}
