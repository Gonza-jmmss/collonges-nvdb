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
import frFR from "@/lang/fr-FR";

export default function ifleStudentNotesAmericanPDF({
  studentNotesData,
}: {
  studentNotesData: QuarterNotesResultViewModel;
}) {
  const t = frFR;

  const columnsToExport: Column<StudentNotesViewModel>[] = [
    {
      value: "ScholarYear",
      name: t.reports.ifleStudentsNotes.dpfEnglish.columns.scholarYear,
      cell: (row: StudentNotesViewModel) =>
        `${row.ScholarYear}   ${row.Quarter}`,
    },
    // {
    //   value: "Quarter",
    //   name: t.reports.ifleStudentsNotes.columns.quarter,
    // },
    {
      value: "CourseCode",
      name: t.reports.ifleStudentsNotes.dpfEnglish.columns.courseCode,
      cell: (row: StudentNotesViewModel) =>
        formatDBCode(row.CourseCode || "").slice(0, -2),
    },
    {
      value: "CourseName",
      name: t.reports.ifleStudentsNotes.dpfEnglish.columns.coursName,
    },
    {
      value: "CreditAmount",
      name: t.reports.ifleStudentsNotes.dpfEnglish.columns.creditAmount,
    },
    {
      value: "AmericanNote",
      name: t.reports.ifleStudentsNotes.dpfEnglish.columns.note,
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
      const leftmargin = 14; // 16 tabla plain
      const rightmargin = 196; // 194 tabla plain
      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      const pageWidth = doc.internal.pageSize.getWidth();

      // // Only for desing face ///////////////////
      //   doc.line(leftmargin, 0, leftmargin, 800);
      //   doc.line(rightmargin, 0, rightmargin, 800);
      // // Only for desing face ///////////////////

      //titleInstitute
      doc.setFontSize(12);
      const titleInstituteText =
        t.reports.ifleStudentsNotes.dpfEnglish.titleInstitute.toUpperCase();
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
        t.reports.ifleStudentsNotes.dpfEnglish.nomCampus.toUpperCase();
      const nomCampusWidth =
        (doc.getStringUnitWidth(nomCampusText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const nomCampusX = (pageWidth - nomCampusWidth) / 2;
      doc.text(nomCampusText, nomCampusX, currentY);
      currentY += 5;

      //bp74
      const bp74Text =
        t.reports.ifleStudentsNotes.dpfEnglish.bp74.toUpperCase();
      const bp74Width =
        (doc.getStringUnitWidth(bp74Text) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const bp74X = (pageWidth - bp74Width) / 2;
      doc.text(bp74Text, bp74X, currentY);
      currentY += 5;

      //address
      const addressText =
        t.reports.ifleStudentsNotes.dpfEnglish.address.toUpperCase();
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
        t.reports.ifleStudentsNotes.dpfEnglish.titleReport.toUpperCase();
      const titleReportWidthMargin =
        (doc.getStringUnitWidth(titleReportText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const titleReportX = (pageWidth - titleReportWidthMargin) / 2;
      doc.text(titleReportText, titleReportX, currentY);
      currentY += 11;

      //studentName
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      const studentNameText =
        t.reports.ifleStudentsNotes.dpfEnglish.data.studentName;
      doc.text(studentNameText, leftmargin, currentY);
      const studentNameTextWithMargin =
        (doc.getStringUnitWidth(studentNameText) * doc.getFontSize()) /
          doc.internal.scaleFactor +
        leftmargin +
        2;
      const studentName = studentNotesData.StudentName?.toUpperCase() || "";
      doc.setFont("helvetica", "normal");
      doc.text(studentName, studentNameTextWithMargin, currentY);
      //dbaseId
      doc.setFont("helvetica", "bold");
      const dbaseIdText = t.reports.ifleStudentsNotes.dpfEnglish.data.dbaseId;
      doc.text(dbaseIdText, 173, currentY);
      const dbaseIdTextWithMargin =
        (doc.getStringUnitWidth(dbaseIdText) * doc.getFontSize()) /
          doc.internal.scaleFactor +
        173 +
        2;
      const dbaseId = studentNotesData.DBaseCode || "";
      doc.setFont("helvetica", "normal");
      doc.text(dbaseId, dbaseIdTextWithMargin, currentY);
      currentY += 5;

      //birthdate
      doc.setFont("helvetica", "bold");
      const birthdateText =
        t.reports.ifleStudentsNotes.dpfEnglish.data.birthdate;
      doc.text(birthdateText, leftmargin, currentY);
      const birthdateTextWithMargin =
        (doc.getStringUnitWidth(birthdateText) * doc.getFontSize()) /
          doc.internal.scaleFactor +
        leftmargin +
        2;
      const birthdate = formatDate(studentNotesData.Birthdate || new Date());
      doc.setFont("helvetica", "normal");
      doc.text(birthdate, birthdateTextWithMargin, currentY);
      const birthdateWithMargin =
        (doc.getStringUnitWidth(birthdate) * doc.getFontSize()) /
          doc.internal.scaleFactor +
        birthdateTextWithMargin +
        2;
      //dateFormat
      const dateFormatText =
        t.reports.ifleStudentsNotes.dpfEnglish.data.dateFormat;
      doc.text(dateFormatText, birthdateWithMargin, currentY);
      //issueDate
      doc.setFont("helvetica", "bold");
      const issueDateText =
        t.reports.ifleStudentsNotes.dpfEnglish.data.issueDate;
      doc.text(issueDateText, 156.5, currentY);
      const issueDateTextWithMargin =
        (doc.getStringUnitWidth(issueDateText) * doc.getFontSize()) /
          doc.internal.scaleFactor +
        156.5 +
        2;
      const issueDate = formatDate(new Date());
      doc.setFont("helvetica", "normal");
      doc.text(issueDate, issueDateTextWithMargin, currentY);
      currentY += 5;

      //place
      doc.setFont("helvetica", "bold");
      const placeText = t.reports.ifleStudentsNotes.dpfEnglish.data.place;
      doc.text(placeText, leftmargin, currentY);
      const placeTextWithMargin =
        (doc.getStringUnitWidth(placeText) * doc.getFontSize()) /
          doc.internal.scaleFactor +
        leftmargin +
        2;
      const place = studentNotesData.BirthCity || "";
      doc.setFont("helvetica", "normal");
      doc.text(place, placeTextWithMargin, currentY);
      //issuedTo
      doc.setFont("helvetica", "bold");
      const issuedToText = t.reports.ifleStudentsNotes.dpfEnglish.data.issuedTo;
      doc.text(issuedToText, 156.5, currentY);
      const issuedToTextWithMargin =
        (doc.getStringUnitWidth(issuedToText) * doc.getFontSize()) /
          doc.internal.scaleFactor +
        156.5 +
        2;
      //
      doc.setFont("helvetica", "normal");
      doc.text("", issuedToTextWithMargin, currentY);
      currentY += 5;

      //country
      doc.setFont("helvetica", "bold");
      const countryText = t.reports.ifleStudentsNotes.dpfEnglish.data.country;
      doc.text(countryText, leftmargin, currentY);
      const countryTextWithMargin =
        (doc.getStringUnitWidth(countryText) * doc.getFontSize()) /
          doc.internal.scaleFactor +
        leftmargin +
        2;
      const country = studentNotesData.BirthCountry || "";
      doc.setFont("helvetica", "normal");
      doc.text(country, countryTextWithMargin, currentY);
      //credits
      doc.setFont("helvetica", "bold");
      const creditsText = t.reports.ifleStudentsNotes.dpfEnglish.data.credits;
      doc.text(creditsText, 156.5, currentY);
      const creditsTextWithMargin =
        (doc.getStringUnitWidth(creditsText) * doc.getFontSize()) /
          doc.internal.scaleFactor +
        156.5 +
        2;
      //
      doc.setFont("helvetica", "normal");
      doc.text("", creditsTextWithMargin, currentY);
      currentY += 7;

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
        columnStyles: {
          CreditAmount: {
            halign: "center",
            cellWidth: 14,
          },
          AmericanNote: {
            halign: "center",
            cellWidth: 14,
          },
        },
      });
      currentY = (doc as any).lastAutoTable.finalY + 10;

      //titleWarning
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      const titleWarningText =
        t.reports.ifleStudentsNotes.dpfEnglish.titleWarning.toUpperCase();
      const titleWarningWidth =
        (doc.getStringUnitWidth(titleWarningText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const titleWarningX = (pageWidth - titleWarningWidth) / 2;
      doc.text(titleWarningText, titleWarningX, currentY);
      currentY += 7;

      doc.line(leftmargin, currentY, rightmargin, currentY);
      currentY += 5;

      //noteText
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      const titleText = t.reports.ifleStudentsNotes.dpfEnglish.text.title;
      doc.text(titleText, leftmargin, currentY);
      const titleTextWithMargin =
        (doc.getStringUnitWidth(titleText) * doc.getFontSize()) /
          doc.internal.scaleFactor +
        leftmargin +
        2;
      //noteText1
      doc.setFont("helvetica", "normal");
      doc.text(
        t.reports.ifleStudentsNotes.dpfEnglish.text.noteText1,
        titleTextWithMargin,
        currentY,
      );
      currentY += 5;
      //noteText2
      doc.setFont("helvetica", "normal");
      doc.text(
        t.reports.ifleStudentsNotes.dpfEnglish.text.noteText2,
        titleTextWithMargin,
        currentY,
      );
      currentY += 5;
      //descText
      doc.setFont("helvetica", "bold");
      doc.text(
        t.reports.ifleStudentsNotes.dpfEnglish.text.descText,
        leftmargin,
        currentY,
      );
      currentY += 3;

      doc.line(leftmargin, currentY, rightmargin, currentY);
      currentY += 15;

      //secretariat
      doc.text(
        t.reports.ifleStudentsNotes.dpfEnglish.secretariat,
        140,
        currentY,
      );
      currentY += 10;

      //date
      doc.text(
        t.reports.ifleStudentsNotes.dpfEnglish.date,
        leftmargin,
        currentY,
      );

      //   const fileName = `Reporte`;
      doc.output("dataurlnewwindow");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button variant="outlineColored" onClick={() => exportToPDF()}>
      {t.reports.ifleStudentsNotes.dpfEnglish.exportPDF}
    </Button>
  );
}
