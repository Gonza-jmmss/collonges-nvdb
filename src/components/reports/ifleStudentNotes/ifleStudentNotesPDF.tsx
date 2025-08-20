"use client";

import { Button } from "@/components/ui/button";
import { StudentNotesViewModel } from "@/repositories/reports/viewModels/StudentNotesViewModel";
import { QuarterNotesResultViewModel } from "@/repositories/reports/viewModels/StudentNotesViewModel";
import { Column } from "@/functions/formatTablePDF";
import formatDBCode from "@/functions/formatDBCode";
import formatTablePDF from "@/functions/formatTablePDF";
import formatDate from "@/functions/formatDate";
import {
  signatureMarta,
  signatureGaby,
  logoIFLE,
  logoCollonge,
  tamponIFLE,
} from "@/lib/imagesBase64";
import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";
import frFR from "@/lang/fr-FR";

export default function ifleStudentNotesPDF({
  studentNotesData,
}: {
  studentNotesData: QuarterNotesResultViewModel;
}) {
  const t = frFR;

  const columnsToExport: Column<StudentNotesViewModel>[] = [
    {
      value: "ScholarYear",
      name: t.reports.ifleStudentsNotes.dpfFrench.columns.scholarYear,
    },
    {
      value: "Quarter",
      name: t.reports.ifleStudentsNotes.dpfFrench.columns.quarter,
    },
    {
      value: "CourseCode",
      name: t.reports.ifleStudentsNotes.dpfFrench.columns.courseCode,
      cell: (row: StudentNotesViewModel) =>
        row.CourseCode?.includes("/")
          ? formatDBCode(row.CourseCode || "").slice(0, -2)
          : row.CourseCode,
      // formatDBCode(row.CourseCode).slice(0, -2),
    },
    {
      value: "CourseName",
      name: t.reports.ifleStudentsNotes.dpfFrench.columns.coursName,
    },
    {
      value: "CreditAmount",
      name: t.reports.ifleStudentsNotes.dpfFrench.columns.creditAmount,
    },
    {
      value: "Note",
      name: t.reports.ifleStudentsNotes.dpfFrench.columns.note,
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
      const fontSize: number =
        studentNotesDataForPdf.length <= 16
          ? 10
          : studentNotesDataForPdf.length === 17
            ? 9.5
            : studentNotesDataForPdf.length === 18
              ? 9
              : studentNotesDataForPdf.length === 19
                ? 8.5
                : studentNotesDataForPdf.length === 20
                  ? 8
                  : studentNotesDataForPdf.length === 21
                    ? 7.5
                    : 7;
      const spaceYAdjustment: number =
        studentNotesDataForPdf.length <= 16
          ? 0
          : studentNotesDataForPdf.length === 17
            ? 0.25
            : studentNotesDataForPdf.length === 18
              ? 0.5
              : studentNotesDataForPdf.length === 19
                ? 0.75
                : studentNotesDataForPdf.length === 20
                  ? 1
                  : studentNotesDataForPdf.length === 21
                    ? 1.25
                    : 1.5;

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");
      const pageWidth = doc.internal.pageSize.getWidth();

      // // Only for desing face ///////////////////
      // doc.line(leftmargin, 0, leftmargin, 800);
      // doc.line(rightmargin, 0, rightmargin, 800);
      // // Only for desing face ///////////////////

      //titleInstitute
      doc.setFontSize(fontSize + 2);
      const titleInstituteText =
        t.reports.ifleStudentsNotes.dpfFrench.titleInstitute.toUpperCase();
      const titleWidth =
        (doc.getStringUnitWidth(titleInstituteText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const TitleInstituteX = (pageWidth - titleWidth) / 2;
      doc.text(titleInstituteText, TitleInstituteX, currentY);
      currentY += 9 - spaceYAdjustment;

      //nomCampus
      doc.setFont("helvetica", "normal");
      doc.setFontSize(fontSize);
      const nomCampusText =
        t.reports.ifleStudentsNotes.dpfFrench.nomCampus.toUpperCase();
      const nomCampusWidth =
        (doc.getStringUnitWidth(nomCampusText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const nomCampusX = (pageWidth - nomCampusWidth) / 2;
      doc.text(nomCampusText, nomCampusX, currentY);
      currentY += 5 - spaceYAdjustment;

      //address1
      const address1Text =
        t.reports.ifleStudentsNotes.dpfFrench.address1.toUpperCase();
      const address1Width =
        (doc.getStringUnitWidth(address1Text) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const address1X = (pageWidth - address1Width) / 2;
      doc.text(address1Text, address1X, currentY);
      currentY += 5 - spaceYAdjustment;

      //address2
      const address2Text =
        t.reports.ifleStudentsNotes.dpfFrench.address2.toUpperCase();
      const address2Width =
        (doc.getStringUnitWidth(address2Text) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const address2X = (pageWidth - address2Width) / 2;
      doc.text(address2Text, address2X, currentY);
      currentY += 9 - spaceYAdjustment;

      //titleReport
      doc.setFont("helvetica", "bold");
      doc.setFontSize(fontSize + 2);
      const titleReportText =
        t.reports.ifleStudentsNotes.dpfFrench.titleReport.toUpperCase();
      const titleReportWidthMargin =
        (doc.getStringUnitWidth(titleReportText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const titleReportX = (pageWidth - titleReportWidthMargin) / 2;
      doc.text(titleReportText, titleReportX, currentY);
      currentY += 11 - spaceYAdjustment;

      //Left Side
      //studentName
      doc.setFont("helvetica", "bold");
      doc.setFontSize(fontSize);
      const studentNameText =
        t.reports.ifleStudentsNotes.dpfFrench.data.studentName;
      doc.text(studentNameText, leftmargin, currentY);
      const studentNameTextWithMargin =
        (doc.getStringUnitWidth(studentNameText) * doc.getFontSize()) /
          doc.internal.scaleFactor +
        leftmargin +
        2;
      const studentName =
        `${studentNotesData.StudentLastName?.toUpperCase()}, ${studentNotesData.StudentFirstName?.toUpperCase()}` ||
        ""; // Apellidos, Nombres
      doc.setFont("helvetica", "normal");
      doc.text(studentName, studentNameTextWithMargin, currentY);
      //Right Side
      //dbaseId
      doc.setFont("helvetica", "bold");
      //dbaseId - texts
      const dbaseIdText = t.reports.ifleStudentsNotes.dpfFrench.data.dbaseId;
      const dbaseIdValueText = studentNotesData.DBaseCode || "";
      //dbaseId - dbaseIdTexstWith
      const dbaseIdTextWith =
        (doc.getStringUnitWidth(dbaseIdText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const dbaseIdValueTextWith =
        (doc.getStringUnitWidth(dbaseIdValueText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const dbaseIdhRightMarginPosition =
        rightmargin - (dbaseIdTextWith + dbaseIdValueTextWith + 2);
      //dbaseId - doc.text
      doc.text(dbaseIdText, dbaseIdhRightMarginPosition, currentY);
      const dbaseIdTextWithMargin =
        (doc.getStringUnitWidth(dbaseIdText) * doc.getFontSize()) /
          doc.internal.scaleFactor +
        dbaseIdhRightMarginPosition +
        2;
      //dbaseId - dbaseIdValueText - doc.text
      doc.setFont("helvetica", "normal");
      doc.text(dbaseIdValueText, dbaseIdTextWithMargin, currentY);
      currentY += 5 - spaceYAdjustment;

      //dbaseId
      // doc.setFont("helvetica", "bold");
      // const dbaseIdText = t.reports.ifleStudentsNotes.dpfFrench.data.dbaseId;
      // doc.text(dbaseIdText, 173, currentY);
      // const dbaseIdTextWithMargin =
      //   (doc.getStringUnitWidth(dbaseIdText) * doc.getFontSize()) /
      //     doc.internal.scaleFactor +
      //   173 +
      //   2;
      // const dbaseIdValueText = studentNotesData.DBaseCode || "";
      // doc.setFont("helvetica", "normal");
      // doc.text(dbaseIdValueText, dbaseIdTextWithMargin, currentY);
      // currentY += 5 - spaceYAdjustment;

      //Left Side
      //birthdate
      doc.setFont("helvetica", "bold");
      const birthdateText =
        t.reports.ifleStudentsNotes.dpfFrench.data.birthdate;
      doc.text(birthdateText, leftmargin, currentY);
      const birthdateTextWithMargin =
        (doc.getStringUnitWidth(birthdateText) * doc.getFontSize()) /
          doc.internal.scaleFactor +
        leftmargin +
        2;
      const birthdate = formatDate(studentNotesData.Birthdate || new Date());
      doc.setFont("helvetica", "normal");
      doc.text(birthdate, birthdateTextWithMargin, currentY);
      //Right Side
      //issueDate
      doc.setFont("helvetica", "bold");
      //issueDate - texts
      const issueDateText =
        t.reports.ifleStudentsNotes.dpfFrench.data.issueDate;
      const issueDateValueText = formatDate(new Date());
      //issueDate - issueDateTexstWith
      const issueDateTextWith =
        (doc.getStringUnitWidth(issueDateText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const issueDateValueTextWith =
        (doc.getStringUnitWidth(issueDateValueText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const issueDatehRightMarginPosition =
        rightmargin - (issueDateTextWith + issueDateValueTextWith + 2);
      //issueDate - doc.text
      doc.text(issueDateText, issueDatehRightMarginPosition, currentY);
      const issueDateTextWithMargin =
        (doc.getStringUnitWidth(issueDateText) * doc.getFontSize()) /
          doc.internal.scaleFactor +
        issueDatehRightMarginPosition +
        2;
      //issueDate - issueDateValueText - doc.text
      doc.setFont("helvetica", "normal");
      doc.text(issueDateValueText, issueDateTextWithMargin, currentY);
      currentY += 5 - spaceYAdjustment;

      //place
      doc.setFont("helvetica", "bold");
      const placeText = t.reports.ifleStudentsNotes.dpfFrench.data.place;
      doc.text(placeText, leftmargin, currentY);
      const placeTextWithMargin =
        (doc.getStringUnitWidth(placeText) * doc.getFontSize()) /
          doc.internal.scaleFactor +
        leftmargin +
        2;
      const place = studentNotesData.BirthCity || "";
      doc.setFont("helvetica", "normal");
      doc.text(place, placeTextWithMargin, currentY);
      currentY += 5 - spaceYAdjustment;

      //country
      doc.setFont("helvetica", "bold");
      const countryText = t.reports.ifleStudentsNotes.dpfFrench.data.country;
      doc.text(countryText, leftmargin, currentY);
      const countryTextWithMargin =
        (doc.getStringUnitWidth(countryText) * doc.getFontSize()) /
          doc.internal.scaleFactor +
        leftmargin +
        2;
      const country = studentNotesData.BirthCountryFr || "";
      doc.setFont("helvetica", "normal");
      doc.text(country, countryTextWithMargin, currentY);
      currentY += 7 - spaceYAdjustment;

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
        styles: { textColor: "#000000", fontSize: fontSize },
        columnStyles: {
          Quarter: { halign: "center" },
          CreditAmount: { halign: "center" },
          Note: { halign: "center" },
        },
      });
      currentY = (doc as any).lastAutoTable.finalY + 10;

      //titleWarning
      doc.setFont("helvetica", "bold");
      doc.setFontSize(fontSize);
      const titleWarningText =
        t.reports.ifleStudentsNotes.dpfFrench.titleWarning.toUpperCase();
      const titleWarningWidth =
        (doc.getStringUnitWidth(titleWarningText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const titleWarningX = (pageWidth - titleWarningWidth) / 2;
      doc.text(titleWarningText, titleWarningX, currentY);
      currentY += 7 - spaceYAdjustment;

      doc.line(leftmargin, currentY, rightmargin, currentY);
      currentY += 5 - spaceYAdjustment;

      //noteText
      // doc.setFont("helvetica", "bold");
      // doc.setFontSize(10);
      const titleText = t.reports.ifleStudentsNotes.dpfFrench.text.title;
      doc.text(titleText, leftmargin, currentY);
      const titleTextWithMargin =
        (doc.getStringUnitWidth(titleText) * doc.getFontSize()) /
          doc.internal.scaleFactor +
        leftmargin +
        2;
      //
      doc.setFont("helvetica", "normal");
      doc.text(
        t.reports.ifleStudentsNotes.dpfFrench.text.noteText,
        titleTextWithMargin,
        currentY,
      );
      currentY += 5 - spaceYAdjustment;
      //
      doc.setFont("helvetica", "bold");
      doc.text(
        t.reports.ifleStudentsNotes.dpfFrench.text.descText,
        leftmargin,
        currentY,
      );
      currentY += 3 - spaceYAdjustment;

      doc.line(leftmargin, currentY, rightmargin, currentY);
      currentY += 15 - spaceYAdjustment;

      //secretariat
      doc.text(
        t.reports.ifleStudentsNotes.dpfFrench.secretariat,
        165,
        currentY,
      );
      //director
      doc.text(t.reports.ifleStudentsNotes.dpfFrench.director, 120, currentY);
      //secretaryName
      doc.setTextColor(141, 154, 208);
      doc.setFont("helvetica", "normal");
      doc.text(t.reports.ifleStudentsNotes.secretaryName, 168, currentY + 28);
      doc.setTextColor(0, 0, 0);
      currentY += 10 - spaceYAdjustment;
      //directorName
      doc.setTextColor(141, 154, 208);
      doc.setFont("helvetica", "normal");
      doc.text(t.reports.ifleStudentsNotes.directorName, 120, currentY + 18);
      doc.setTextColor(0, 0, 0);
      // currentY += spaceYAdjustment;

      //date
      const dateText = t.reports.ifleStudentsNotes.dpfFrench.date;
      doc.text(
        t.reports.ifleStudentsNotes.dpfFrench.date,
        leftmargin,
        currentY - 8,
      );
      const dateTextWithMargin =
        (doc.getStringUnitWidth(dateText) * doc.getFontSize()) /
          doc.internal.scaleFactor +
        leftmargin +
        2;
      const date = formatDate(new Date());
      doc.setFont("helvetica", "normal");
      doc.text(date, dateTextWithMargin, currentY - 8);

      //img logoCollong
      doc.addImage(logoCollonge, "PNG", leftmargin, 11, 30, 30);
      //img logoIFLE
      doc.addImage(logoIFLE, "PNG", rightmargin - 30, 10, 30, 30);
      //img signatureMarta
      doc.addImage(signatureMarta, "PNG", 160, currentY - 9, 29, 25);
      //img signatureBagy
      doc.addImage(signatureGaby, "PNG", 110, currentY - 18, 40, 35);
      //img tamponeIFLE
      doc.addImage(tamponIFLE, "PNG", 30, currentY + 5, 50, 10);

      // // guideLine for the logos /////////////////////////
      // doc.line(leftmargin, 30, leftmargin + 5, 30);
      // doc.line(leftmargin + 5, 10, leftmargin + 5, 43);

      // doc.line(leftmargin + 5, 10, rightmargin - 5, 10);
      // doc.line(leftmargin + 5, 43, rightmargin - 5, 43);
      // doc.line(leftmargin + 5, 30, rightmargin - 5, 30);

      // doc.line(rightmargin - 5, 30, rightmargin, 30);
      // doc.line(rightmargin - 5, 10, rightmargin - 5, 43);
      // // guideLine for the logos /////////////////////////

      // const fileName = `Transcript francais ${studentName} ${studentNotesData.CourseNotes[0].ScholarYear} ${studentNotesData.CourseNotes[0].Quarter}`;
      const fileName = `Relevé Officiel des Cours et des Notes T${studentNotesData.CourseNotes[studentNotesData.CourseNotes.length - 1].Quarter} ${studentNotesData.CourseNotes[studentNotesData.CourseNotes.length - 1].ScholarYear}  ${studentName}`;
      doc.output("dataurlnewwindow");
      doc.save(fileName);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button variant="outlineColored" onClick={() => exportToPDF()}>
      {t.reports.ifleStudentsNotes.dpfFrench.exportPDF}
    </Button>
  );
}
