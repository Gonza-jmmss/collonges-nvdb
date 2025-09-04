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
import Combobox from "@/components/common/combobox";
import enumToArray from "@/functions/enumToArray";
import { PeriodEnum } from "@/enum/periodEnum";
import { useRouter, useSearchParams } from "next/navigation";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import frFR from "@/lang/fr-FR";

export default function TeacherCoursesTable({
  teacherCourses,
  periodNumberSelected,
  urlParams,
}: {
  teacherCourses: TeacherCoursesViewModel[];
  periodNumberSelected: number;
  urlParams?: { [key: string]: string | string[] | undefined };
}) {
  const t = frFR;
  const router = useRouter();
  const updateQuery = useUpdateQuery();
  const searchParams = useSearchParams();

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
        header: () => <Header text={t.teacherCourses.columns.isEnabled} />,
        filterFn: "includesStringSensitive",
        cell: (row) => (
          <span className={`${row.getValue() == 1 ? "text-green-600" : ""}`}>
            {row.getValue() == 1 ? t.shared.yes : t.shared.no}
          </span>
        ),
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
                  `/courses/teacherCourses/${row.row.original?.UserId}?action="edit"&periodNumber=${periodNumberSelected}`,
                )
              }
            />
          </div>
        ),
      },
    ],
    [periodNumberSelected],
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
        cell: (x) =>
          x.getValue().includes("/") ? x.getValue().slice(0, -2) : x.getValue(),
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
            options={enumToArray(PeriodEnum).slice(1)}
            textAttribute="value"
            valueAttribute="key"
            placeholder={t.levels.form.periodNumber}
            itemSelected={enumToArray(PeriodEnum).find(
              (x) => x.key === periodNumberSelected,
            )}
            setItemSelected={(x: { key: number }) => {
              handleUrlParameterChange("periodNumber", `${x.key}`);
            }}
          />
        </div>
      </div>
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
    </div>
  );
}
