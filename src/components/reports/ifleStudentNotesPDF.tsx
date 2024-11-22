"use client";

import { Button } from "@/components/ui/button";
import { StudentNotesViewModel } from "@/repositories/reports/viewModels/StudentNotesViewModel";
import { QuarterNotesResultViewModel } from "@/repositories/reports/viewModels/StudentNotesViewModel";
import { Column } from "@/functions/formatTablePDF";
import formatDBCode from "@/functions/formatDBCode";
import formatTablePDF from "@/functions/formatTablePDF";
import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";
import enUS from "@/lang/en-US";

export default function ifleStudentNotesPDF({
  studentNotesData,
}: {
  studentNotesData: QuarterNotesResultViewModel;
}) {
  const t = enUS;

  const columnsToExport: Column<StudentNotesViewModel>[] = [
    {
      value: "ScholarYear",
      name: t.reports.ifleStudentsNotes.columns.scholarYear,
    },
    {
      value: "Quarter",
      name: t.reports.ifleStudentsNotes.columns.quarter,
    },
    {
      value: "CourseCode",
      name: t.reports.ifleStudentsNotes.columns.courseCode,
      cell: (row: any) => formatDBCode(row.CourseCode).slice(0, -2),
    },
    {
      value: "CourseName",
      name: t.reports.ifleStudentsNotes.columns.coursName,
    },
    {
      value: "CreditAmount",
      name: t.reports.ifleStudentsNotes.columns.creditAmount,
    },
    {
      value: "Note",
      name: t.reports.ifleStudentsNotes.columns.note,
    },
  ];

  const studentNotesDataForPdf: StudentNotesViewModel[] = [
    ...studentNotesData.CourseNotes,
  ];

  const exportToPDF = () => {
    try {
      const tablePDF = formatTablePDF(columnsToExport, studentNotesDataForPdf);
      const doc = new jsPDF("l", "mm", "a4");
      doc.setTextColor(0, 0, 0);
      doc.setFont("arial", "bold");
      //Table
      autoTable(doc, {
        body: tablePDF.body,
        columns: tablePDF.columns,
        startY: 35,
        theme: "plain",
        // theme: "grid",
        styles: { textColor: "#000000" },
      });

      //   const fileName = `Reporte`;
      doc.output("dataurlnewwindow");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button variant="outline" onClick={() => exportToPDF()}>
      {t.shared.exportPDF}
    </Button>
  );
}
