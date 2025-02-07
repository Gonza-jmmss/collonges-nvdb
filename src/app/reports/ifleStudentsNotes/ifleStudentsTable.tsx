"use client";

import { useState, useEffect, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import { StudentsViewModel } from "@/repositories/students/studentsViewModel";
import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function StudentsTable({
  studentsData,
}: {
  studentsData: StudentsViewModel[];
}) {
  const t = frFR;
  const router = useRouter();

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
        cell: (x) => (x.getValue() == 1 ? t.shared.yes : t.shared.no),
        header: () => <Header text={t.students.columns.isACA} />,
        filterFn: "includesStringSensitive",
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

  return (
    <main className="">
      <Table
        columns={columns}
        data={studentsData}
        className=""
        onRowClick={(row) =>
          router.push(`/reports/ifleStudentsNotes/${row.StudentId}`)
        }
        // onRowClick={(row) => console.log("onClick", row)}
      />
    </main>
  );
}
