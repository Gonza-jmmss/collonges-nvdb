"use client";

import { Button } from "@/components/ui/button";
import { StudentNotesViewModel } from "@/repositories/reports/viewModels/StudentNotesViewModel";
import { QuarterNotesResultViewModel } from "@/repositories/reports/viewModels/StudentNotesViewModel";
import { Column } from "@/functions/formatTablePDF";
import formatDBCode from "@/functions/formatDBCode";
import formatTablePDF from "@/functions/formatTablePDF";
import formatDate from "@/functions/formatDate";
import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";
import enUS from "@/lang/en-US";
import { date } from "zod";

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
      const doc = new jsPDF("p", "mm", "a4");
      let currentY = 14; // Start position for content
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      const pageWidth = doc.internal.pageSize.getWidth();

      //titleInstitute
      doc.setFontSize(12);
      const titleInstituteText =
        t.reports.ifleStudentsNotes.dpf.titleInstitute.toUpperCase();
      const titleWidth =
        (doc.getStringUnitWidth(titleInstituteText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const TitleInstituteX = (pageWidth - titleWidth) / 2;
      doc.text(titleInstituteText, TitleInstituteX, currentY);
      currentY += 9;

      //nomCampus
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const nomCampusText =
        t.reports.ifleStudentsNotes.dpf.nomCampus.toUpperCase();
      const nomCampusWidth =
        (doc.getStringUnitWidth(nomCampusText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const nomCampusX = (pageWidth - nomCampusWidth) / 2;
      doc.text(nomCampusText, nomCampusX, currentY);
      currentY += 5;

      //bp74
      const bp74Text = t.reports.ifleStudentsNotes.dpf.bp74.toUpperCase();
      const bp74Width =
        (doc.getStringUnitWidth(bp74Text) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const bp74X = (pageWidth - bp74Width) / 2;
      doc.text(bp74Text, bp74X, currentY);
      currentY += 5;

      //address
      const addressText = t.reports.ifleStudentsNotes.dpf.address.toUpperCase();
      const addressWidth =
        (doc.getStringUnitWidth(addressText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const addressX = (pageWidth - addressWidth) / 2;
      doc.text(addressText, addressX, currentY);
      currentY += 9;

      //titleReport
      doc.setFont("helvetica", "bold");
      doc.setFontSize(12);
      const titleReportText =
        t.reports.ifleStudentsNotes.dpf.titleReport.toUpperCase();
      const titleReportWidth =
        (doc.getStringUnitWidth(titleReportText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const titleReportX = (pageWidth - titleReportWidth) / 2;
      doc.text(titleReportText, titleReportX, currentY);
      currentY += 11;

      //studentName
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(t.reports.ifleStudentsNotes.dpf.data.studentName, 16, currentY);
      const studentName = studentNotesData.StudentName?.toUpperCase() || "";
      doc.setFont("helvetica", "normal");
      doc.text(studentName, 53, currentY);
      //dbaseId
      doc.setFont("helvetica", "bold");
      doc.text(t.reports.ifleStudentsNotes.dpf.data.dbaseId, 171, currentY);
      const dbaseId = studentNotesData.DBaseCode || "";
      doc.setFont("helvetica", "normal");
      doc.text(dbaseId, 184, currentY);
      currentY += 5;

      //birthdate
      doc.setFont("helvetica", "bold");
      doc.text(t.reports.ifleStudentsNotes.dpf.data.birthdate, 16, currentY);
      const birthdate = formatDate(studentNotesData.BirthDate || new Date());
      doc.setFont("helvetica", "normal");
      doc.text(birthdate, 33, currentY);
      //emitionDate
      doc.setFont("helvetica", "bold");
      doc.text(t.reports.ifleStudentsNotes.dpf.data.emitionDate, 133, currentY);
      const emitionDate = formatDate(new Date());
      doc.setFont("helvetica", "normal");
      doc.text(emitionDate, 180, currentY);
      currentY += 5;

      //place
      doc.setFont("helvetica", "bold");
      doc.text(t.reports.ifleStudentsNotes.dpf.data.place, 16, currentY);
      const place = studentNotesData.BirthCity || "";
      doc.setFont("helvetica", "normal");
      doc.text(place, 27, currentY);
      currentY += 5;

      //country
      doc.setFont("helvetica", "bold");
      doc.text(t.reports.ifleStudentsNotes.dpf.data.country, 16, currentY);
      const country = studentNotesData.BirthCountry || "";
      doc.setFont("helvetica", "normal");
      doc.text(country, 28, currentY);
      currentY += 7;

      // doc.line(16, 77, 194, 77);

      //Table
      autoTable(doc, {
        body: tablePDF.body,
        columns: tablePDF.columns,
        startY: currentY,
        theme: "grid",
        headStyles: {
          lineWidth: 0.3,
          fillColor: [255, 255, 255],
          textColor: [0, 0, 0],
        },
        tableLineWidth: 0.2,
        styles: { textColor: "#000000" },
        // theme: "striped",
        // headStyles: {
        //   fillColor: [255, 255, 255],
        //   textColor: [0, 0, 0],
        // },
        // tableLineWidth: 0.2,
        // styles: { textColor: "#000000" },
      });
      currentY = (doc as any).lastAutoTable.finalY + 10;

      //titleWarning
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      const titleWarningText =
        t.reports.ifleStudentsNotes.dpf.titleWarning.toUpperCase();
      const titleWarningWidth =
        (doc.getStringUnitWidth(titleWarningText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const titleWarningX = (pageWidth - titleWarningWidth) / 2;
      doc.text(titleWarningText, titleWarningX, currentY);
      currentY += 7;

      doc.line(16, currentY, 194, currentY);
      currentY += 5;

      //noteText
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(t.reports.ifleStudentsNotes.dpf.text.title, 16, currentY);
      //
      doc.setFont("helvetica", "normal");
      doc.text(t.reports.ifleStudentsNotes.dpf.text.noteText, 30, currentY);
      currentY += 5;
      //
      doc.setFont("helvetica", "bold");
      doc.text(t.reports.ifleStudentsNotes.dpf.text.descText, 16, currentY);
      currentY += 3;

      doc.line(16, currentY, 194, currentY);
      currentY += 15;

      doc.text(t.reports.ifleStudentsNotes.dpf.secretariat, 140, currentY);
      currentY += 10;

      doc.text(t.reports.ifleStudentsNotes.dpf.date, 16, currentY);

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
