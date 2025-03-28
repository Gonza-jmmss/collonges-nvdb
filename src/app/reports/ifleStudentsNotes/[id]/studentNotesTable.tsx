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
  transcriptType,
}: {
  studentNotesData: StudentNotesViewModel[];
  transcriptType: "french" | "american";
}) {
  const t = frFR;

  const frenchColumns = useMemo<ColumnDef<StudentNotesViewModel, any>[]>(
    () => [
      {
        accessorKey: "ScholarYear",
        id: "ScholarYear",
        header: () => (
          <Header
            text={t.reports.ifleStudentsNotes.dpfFrench.columns.scholarYear}
          />
        ),
        filterFn: "equalsString",
      },
      {
        accessorKey: "Quarter",
        id: "Quarter",
        header: () => (
          <Header
            text={t.reports.ifleStudentsNotes.dpfFrench.columns.quarter}
          />
        ),
        filterFn: "equalsString",
      },
      {
        accessorKey: "CourseCode",
        id: "CourseCode",
        header: () => (
          <Header
            text={t.reports.ifleStudentsNotes.dpfFrench.columns.courseCode}
          />
        ),
        cell: (x) => formatDBCode(x.getValue()).slice(0, -2),
        filterFn: "equalsString",
      },
      {
        accessorKey: "CourseName",
        id: "CourseName",
        header: () => (
          <Header
            text={t.reports.ifleStudentsNotes.dpfFrench.columns.coursName}
          />
        ),
        filterFn: "equalsString",
        size: 350,
      },
      {
        accessorKey: "CreditAmount",
        id: "CreditAmount",
        header: () => (
          <Header
            text={t.reports.ifleStudentsNotes.dpfFrench.columns.creditAmount}
          />
        ),
        filterFn: "equalsString",
      },
      {
        accessorKey: "Note",
        id: "Note",
        header: () => (
          <Header text={t.reports.ifleStudentsNotes.dpfFrench.columns.note} />
        ),
        filterFn: "equalsString",
      },
    ],
    [],
  );
  const AmericanColumns = useMemo<ColumnDef<StudentNotesViewModel, any>[]>(
    () => [
      {
        accessorKey: "ScholarYear",
        id: "ScholarYear",
        header: () => (
          <Header
            text={t.reports.ifleStudentsNotes.dpfEnglish.columns.scholarYear}
          />
        ),
        cell: (row) => (
          <div className="flex space-x-4">
            <span>{row.row.original.ScholarYear}</span>
            <span>{row.row.original.Quarter}</span>
          </div>
        ),
        filterFn: "equalsString",
      },
      {
        accessorKey: "CourseCode",
        id: "CourseCode",
        header: () => (
          <Header
            text={t.reports.ifleStudentsNotes.dpfEnglish.columns.courseCode}
          />
        ),
        cell: (x) => formatDBCode(x.getValue()).slice(0, -2),
        filterFn: "equalsString",
      },
      {
        accessorKey: "CoursEnglishName",
        id: "CoursEnglishName",
        header: () => (
          <Header
            text={t.reports.ifleStudentsNotes.dpfEnglish.columns.coursName}
          />
        ),
        filterFn: "equalsString",
        size: 350,
      },
      {
        accessorKey: "CreditAmount",
        id: "CreditAmount",
        header: () => (
          <Header
            text={t.reports.ifleStudentsNotes.dpfEnglish.columns.creditAmount}
          />
        ),
        filterFn: "equalsString",
      },
      {
        accessorKey: "AmericanNote",
        id: "AmericanNote",
        header: () => (
          <Header text={t.reports.ifleStudentsNotes.dpfEnglish.columns.note} />
        ),
        // cell: (row) => <div className="text-center">{row.getValue()}</div>,
        filterFn: "equalsString",
      },
    ],
    [],
  );

  return (
    <main className="">
      <div className="mt-5">
        <Table
          columns={
            transcriptType === "french" ? frenchColumns : AmericanColumns
          }
          data={studentNotesData}
          className=""
          minimalMode
        />
      </div>
    </main>
  );
}
