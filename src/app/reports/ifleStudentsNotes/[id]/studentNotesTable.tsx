"use client";

import { useState, useEffect, useMemo } from "react";
import { ColumnDef } from "@tanstack/react-table";
import Table from "@/components/table/table";
import Header from "@/components/table/header";
import { StudentNotesViewModel } from "@/repositories/reports/viewModels/StudentNotesViewModel";
import formatDBCode from "@/functions/formatDBCode";
import frFR from "@/lang/fr-FR";

export default function StudentsTable({
  studentNotesData,
}: {
  studentNotesData: StudentNotesViewModel[];
}) {
  const t = frFR;

  const columns = useMemo<ColumnDef<StudentNotesViewModel, any>[]>(
    () => [
      {
        accessorKey: "ScholarYear",
        id: "ScholarYear",
        header: () => (
          <Header text={t.reports.ifleStudentsNotes.columns.scholarYear} />
        ),
        filterFn: "equalsString",
      },
      {
        accessorKey: "Quarter",
        id: "Quarter",
        header: () => (
          <Header text={t.reports.ifleStudentsNotes.columns.quarter} />
        ),
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
        filterFn: "equalsString",
      },
      {
        accessorKey: "CreditAmount",
        id: "CreditAmount",
        header: () => (
          <Header text={t.reports.ifleStudentsNotes.columns.creditAmount} />
        ),
        filterFn: "equalsString",
      },
      {
        accessorKey: "Note",
        id: "Note",
        header: () => (
          <Header text={t.reports.ifleStudentsNotes.columns.note} />
        ),
        filterFn: "equalsString",
      },
      {
        accessorKey: "AmericanNote",
        id: "AmericanNote",
        header: () => (
          <Header text={t.reports.ifleStudentsNotes.columns.americanNote} />
        ),
        filterFn: "equalsString",
      },
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
        />
      </div>
    </main>
  );
}
