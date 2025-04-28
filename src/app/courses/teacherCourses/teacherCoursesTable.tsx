"use client";

import { useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import Icon from "@/components/common/icon";
import {
  TeacherCoursesViewModel,
  TeacherCoursesExtendedViewModel,
} from "@/repositories/teacherCourses/teacherCoursesViewModel";
import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function TeacherCoursesTable({
  teacherCourses,
}: {
  teacherCourses: TeacherCoursesViewModel[];
}) {
  const t = frFR;
  const router = useRouter();

  const columns = useMemo<ColumnDef<TeacherCoursesViewModel, any>[]>(
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
            {row.original.TeacherCourses.length > 0 && row.getCanExpand() ? (
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
        header: () => <Header text={t.teacherCourses.columns.coursesAsigned} />,
        filterFn: "equalsString",
        cell: ({ row }) => <span>{row.original.TeacherCourses.length}</span>,
        size: 20,
      },
      {
        accessorKey: "UserName",
        id: "UserName",
        header: () => <Header text={t.teacherCourses.columns.userName} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "IsEnabled",
        id: "IsEnabled",
        cell: (x) => (x.getValue() == 1 ? t.shared.yes : t.shared.no),
        header: () => <Header text={t.teacherCourses.columns.isEnabled} />,
        filterFn: "includesStringSensitive",
      },
      {
        accessorKey: "actions",
        id: "actions",
        header: () => <Header text={t.shared.actions} />,
        size: 50,
        cell: (row) => (
          <div
            className="flex space-x-1"
            onClick={(event) => event.stopPropagation()}
          >
            <Icon
              name="MdEdit"
              className="cursor-pointer text-xl hover:text-primary"
              onClick={() =>
                router.push(
                  `/courses/teacherCourses/${row.row.original?.UserId}?action="edit"`,
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
    ColumnDef<TeacherCoursesExtendedViewModel, any>[]
  >(
    () => [
      {
        accessorKey: "Name",
        id: "Name",
        header: () => <Header text={t.teacherCourses.expanded.name} />,
        filterFn: "equalsString",
      },
      {
        accessorKey: "CourseCode",
        id: "CourseCode",
        header: () => <Header text={t.teacherCourses.expanded.courseCode} />,
        filterFn: "equalsString",
        size: 30,
      },
      {
        accessorKey: "CreditAmount",
        id: "CreditAmount",
        header: () => <Header text={t.teacherCourses.expanded.creditAmount} />,
        filterFn: "equalsString",
        size: 30,
      },
    ],
    [],
  );

  return (
    <Table
      columns={columns}
      data={teacherCourses}
      className=""
      expandable
      expandedContent={(row) => (
        <Table
          columns={columnsExtended}
          data={row.TeacherCourses}
          minimalMode
          noBorders
        />
      )}
    />
  );
}
