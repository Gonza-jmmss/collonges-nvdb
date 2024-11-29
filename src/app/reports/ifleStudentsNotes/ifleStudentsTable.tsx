"use client";

import { useState, useEffect, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import { Students } from "@prisma/client";
import { useRouter } from "next/navigation";
import frFR from "@/lang/fr-FR";

export default function StudentsTable({
  studentsData,
}: {
  studentsData: Students[];
}) {
  const t = frFR;
  const router = useRouter();

  const columns = useMemo<ColumnDef<Students, any>[]>(
    () => [
      // {
      //   accessorKey: "StudentId",
      //   id: "StudentId",
      //   header: () => <Header text={t.student.columns.id} />,
      //   // cell: (info) => info.getValue(),
      //   filterFn: "equalsString",
      // },
      {
        accessorKey: "DBaseCode",
        id: "DBaseCode",
        header: () => <Header text={t.student.columns.dBaseCode} />,
        // cell: (info) => info.getValue(),
        filterFn: "equalsString",
      },
      {
        accessorKey: "StudentName",
        id: "StudentName",
        header: () => <Header text={t.student.columns.studentName} />,
        // cell: (info) => info.getValue(),
        filterFn: "equalsString",
      },
      {
        accessorKey: "StudentType",
        id: "StudentType",
        header: () => <Header text={t.student.columns.studentType} />,
        // cell: (info) => info.getValue(),
        filterFn: "equalsString",
      },
      {
        accessorKey: "IsACA",
        id: "IsACA",
        cell: (x) => (x.getValue() == 1 ? t.shared.yes : t.shared.no),
        header: () => <Header text={t.student.columns.isACA} />,
        filterFn: "includesStringSensitive",
      },
      // {
      //   accessorKey: "actions",
      //   id: "actions",
      //   header: () => <Header text={t.student.columns.actions} />,
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
