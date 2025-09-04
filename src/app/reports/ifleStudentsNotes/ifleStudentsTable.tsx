"use client";

import { useState, useEffect, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import Combobox from "@/components/common/combobox";
import { useUpdateQuery } from "@/hooks/useUpdateQuery";
import { StudentsViewModel } from "@/repositories/students/studentsViewModel";
import { yearPeriodsViewModel } from "@/repositories/yearPeriods/yearPeriodsViewModel";
import { useRouter, useSearchParams } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function StudentsTable({
  studentsData,
  yearPeriods,
  yearPeriodIdSelected,
  pageIndex,
  pageSize,
}: {
  studentsData: StudentsViewModel[];
  yearPeriods: yearPeriodsViewModel[];
  yearPeriodIdSelected: number | null;
  pageIndex: number;
  pageSize: number;
}) {
  const t = frFR;
  const router = useRouter();
  const searchParams = useSearchParams();
  const updateQuery = useUpdateQuery();

  const getPageIndexParam = searchParams.get("pageIndex");
  const getPageSizeParam = searchParams.get("pageSize");

  const columns = useMemo<ColumnDef<StudentsViewModel, any>[]>(
    () => [
      // {
      //   accessorKey: "StudentId",
      //   id: "StudentId",
      //   header: () => <Header text={t.students.columns.id} />,
      //   // cell: (info) => info.getValue(),
      //   filterFn: "equalsString",
      // },
      {
        accessorKey: "DBaseCode",
        id: "DBaseCode",
        header: () => <Header text={t.students.columns.dBaseCode} />,
        // cell: (info) => info.getValue(),
        filterFn: "equalsString",
      },
      {
        accessorKey: "StudentName",
        id: "StudentName",
        header: () => <Header text={t.students.columns.studentName} />,
        // cell: (info) => info.getValue(),
        filterFn: "equalsString",
      },
      {
        accessorKey: "StudentType",
        id: "StudentType",
        header: () => <Header text={t.students.columns.studentType} />,
        // cell: (info) => info.getValue(),
        filterFn: "equalsString",
      },
      {
        accessorKey: "IsACA",
        id: "IsACA",
        header: () => <Header text={t.students.columns.isACA} />,
        filterFn: "includesStringSensitive",
        cell: (row) => (
          <span className={`${row.getValue() == 1 ? "text-green-600" : ""}`}>
            {row.getValue() == 1 ? t.shared.yes : t.shared.no}
          </span>
        ),
      },
      // {
      //   accessorKey: "actions",
      //   id: "actions",
      //   header: () => <Header text={t.students.columns.actions} />,
      //   cell: () => <div>Notes</div>,
      // },
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
            options={yearPeriods}
            textAttribute="Name"
            valueAttribute="YearPeriodId"
            placeholder={t.students.form.yearPeriodId}
            itemSelected={yearPeriods.find(
              (x) => x.YearPeriodId === yearPeriodIdSelected,
            )}
            setItemSelected={(x: { YearPeriodId: number }) => {
              handleUrlParameterChange(
                "yearPeriodId",
                `${x ? x.YearPeriodId : null}`,
              );
            }}
            showSearch
          />
        </div>
      </div>
      <Table
        columns={columns}
        data={studentsData}
        className=""
        onRowClick={(row) =>
          router.push(
            `/reports/ifleStudentsNotes/${row.StudentId}?pageIndex=${getPageIndexParam}&pageSize=${getPageSizeParam}&yearPeriodId=${yearPeriodIdSelected}`,
          )
        }
        pageIndexParam={pageIndex}
        pageSizeParam={pageSize}
      />
    </div>
  );
}
