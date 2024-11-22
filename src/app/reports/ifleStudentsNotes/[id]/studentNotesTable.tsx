"use client";

import { useState, useEffect, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import { StudentNotesViewModel } from "@/repositories/reports/viewModels/StudentNotesViewModel";
import formatDBCode from "@/functions/formatDBCode";
// import { Students } from "@prisma/client";
import enUS from "@/lang/en-US";

export default function StudentsTable({
  studentNotesData,
}: {
  studentNotesData: StudentNotesViewModel[];
}) {
  const t = enUS;

  // const formatDBCode = (input: string) => {
  //   return input.replace(/([A-Za-z])(\d)/, "$1 $2");
  // };

  const columns = useMemo<ColumnDef<StudentNotesViewModel, any>[]>(
    () => [
      {
        accessorKey: "ScholarYear",
        id: "ScholarYear",
        header: () => (
          <Header text={t.reports.ifleStudentsNotes.columns.scholarYear} />
        ),
        // cell: (info) => info.getValue(),
        filterFn: "equalsString",
      },
      {
        accessorKey: "Quarter",
        id: "Quarter",
        header: () => (
          <Header text={t.reports.ifleStudentsNotes.columns.quarter} />
        ),
        // cell: (info) => info.getValue(),
        filterFn: "equalsString",
      },
      {
        accessorKey: "CourseCode",
        id: "CourseCode",
        header: () => (
          <Header text={t.reports.ifleStudentsNotes.columns.courseCode} />
        ),
        cell: (x) => formatDBCode(x.getValue()).slice(0, -2),
        filterFn: "equalsString",
      },
      {
        accessorKey: "CourseName",
        id: "CourseName",
        header: () => (
          <Header text={t.reports.ifleStudentsNotes.columns.coursName} />
        ),
        // cell: (info) => info.getValue(),
        filterFn: "equalsString",
      },
      {
        accessorKey: "CreditAmount",
        id: "CreditAmount",
        header: () => (
          <Header text={t.reports.ifleStudentsNotes.columns.creditAmount} />
        ),
        // cell: (info) => info.getValue(),
        filterFn: "equalsString",
      },
      {
        accessorKey: "Note",
        id: "Note",
        // cell: (x) => (x.getValue() == 1 ? t.shared.yes : t.shared.no),
        header: () => (
          <Header text={t.reports.ifleStudentsNotes.columns.note} />
        ),
        filterFn: "equalsString",
      },
      //   {
      //     accessorKey: "actions",
      //     id: "actions",
      //     header: () => <Header text={t.student.columns.actions} />,
      //     cell: () => <div>Notes</div>,
      //   },
    ],
    [],
  );

  return (
    <main className="">
      <div className="mt-5">
        <Table
          columns={columns}
          data={studentNotesData}
          className=""
          minimalMode
          // onRowClick={(row) => console.log("onClick", row)}
        />
      </div>
    </main>
  );
}
