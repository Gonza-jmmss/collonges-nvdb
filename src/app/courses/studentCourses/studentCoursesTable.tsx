"use client";

import { useState, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import { Button } from "@/components/ui/button";
import Icon from "@/components/common/icon";
import isValidIconName from "@/functions/isValidIconName";
// import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import {
  StudentCoursesViewModel,
  StudentCoursesExtendedViewModel,
} from "@/repositories/studentCourses/studentCoursesViewModel";
import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function StudentCoursesTable({
  studentCoursesData,
  urlParams,
}: {
  studentCoursesData: StudentCoursesViewModel[];
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const router = useRouter();
  // const updateQuery = useUpdateQuery();

  const [expandedContent, setExpandedContent] = useState<React.ReactNode>();

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
      {
        accessorKey: "StudentId",
        id: "StudentId",
        header: () => <Header text={t.studentCourses.columns.studentId} />,
        filterFn: "equalsString",
        // cell: ({ row, getValue }) => (
        //   <div
        //     style={{
        //       paddingLeft: `${row.depth * 2}rem`,
        //     }}
        //   >
        //     <div className="flex items-center space-x-2">
        //       {row.getCanExpand() ? (
        //         <div onClick={row.getToggleExpandedHandler()}>
        //           {row.getIsExpanded() ? (
        //             <Icon
        //               name={
        //                 isValidIconName("MdArrowDownward")
        //                   ? "MdArrowDownward"
        //                   : "MdOutlineNotInterested"
        //               }
        //               onClick={() => handleRowClick(null)}
        //             />
        //           ) : (
        //             <Icon
        //               name={
        //                 isValidIconName("MdArrowForward")
        //                   ? "MdArrowForward"
        //                   : "MdOutlineNotInterested"
        //               }
        //               onClick={() => handleRowClick(row.original)}
        //             />
        //           )}
        //         </div>
        //       ) : (
        //         <Icon
        //   name={
        //     isValidIconName("MdHorizontalRule")
        //       ? "MdHorizontalRule"
        //       : "MdOutlineNotInterested"
        //   }
        // />
        //       )}
        //       <div>{getValue<boolean>()}</div>
        //     </div>
        //   </div>
        // ),
      },
      {
        accessorKey: "AlternativeName",
        id: "AlternativeName",
        header: () => (
          <Header text={t.studentCourses.columns.alternativeName} />
        ),
        filterFn: "equalsString",
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
                  `/courses/studentCourses/${row.row.original.StudentId}?action="edit"`,
                )
              }
            />
          </div>
        ),
      },
    ],
    [],
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

  return (
    <div>
      <div className="flex items-center justify-end space-x-5">
        <div className="text-emerald-400">
          Falta poner filtros de CoursePeriods
        </div>
        <Button
          variant="outlineColored"
          onClick={() =>
            router.push(`/courses/studentCourses/create?action="create"`)
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
