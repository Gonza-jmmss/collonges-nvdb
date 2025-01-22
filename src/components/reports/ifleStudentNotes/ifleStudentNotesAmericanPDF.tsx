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
  logoIFLE,
  logoCollonge,
  tamponIFLE,
} from "@/lib/imagesBase64";
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
      value: "CoursEnglishName",
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

  const exportToPDF = async () => {
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
      // doc.line(leftmargin, 0, leftmargin, 800);
      // doc.line(rightmargin, 0, rightmargin, 800);
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

      //address1
      const address1Text =
        t.reports.ifleStudentsNotes.dpfEnglish.address1.toUpperCase();
      const address1Width =
        (doc.getStringUnitWidth(address1Text) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const address1X = (pageWidth - address1Width) / 2;
      doc.text(address1Text, address1X, currentY);
      currentY += 5;

      //address2
      const address2Text =
        t.reports.ifleStudentsNotes.dpfEnglish.address2.toUpperCase();
      const address2Width =
        (doc.getStringUnitWidth(address2Text) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const address2X = (pageWidth - address2Width) / 2;
      doc.text(address2Text, address2X, currentY);
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
      const studentName =
        `${studentNotesData.StudentLastName?.toUpperCase()}, ${studentNotesData.StudentFirstName?.toUpperCase()}` ||
        ""; // Apellidos, Nombres
      doc.setFont("helvetica", "normal");
      doc.text(studentName, studentNameTextWithMargin, currentY);
      //Right Side
      //dbaseId
      doc.setFont("helvetica", "bold");
      //dbaseId - texts
      const dbaseIdText = t.reports.ifleStudentsNotes.dpfEnglish.data.dbaseId;
      const dBaseCodeText = studentNotesData.DBaseCode || "";
      //dbaseId - dbaseIdTexstWith
      const dbaseIdTextWith =
        (doc.getStringUnitWidth(dbaseIdText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const dBaseCodeTextWith =
        (doc.getStringUnitWidth(dBaseCodeText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const dbaseIdhRightMarginPosition =
        rightmargin - (dbaseIdTextWith + dBaseCodeTextWith + 2);
      //dbaseId - doc.text
      doc.text(dbaseIdText, dbaseIdhRightMarginPosition, currentY);
      const dbaseIdTextWithMargin =
        (doc.getStringUnitWidth(dbaseIdText) * doc.getFontSize()) /
          doc.internal.scaleFactor +
        dbaseIdhRightMarginPosition +
        2;
      //dbaseId - dBaseCodeText - doc.text
      doc.setFont("helvetica", "normal");
      doc.text(dBaseCodeText, dbaseIdTextWithMargin, currentY);
      currentY += 5;

      //Left Side
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
      //Right Side
      //issueDate
      doc.setFont("helvetica", "bold");
      //issueDate - texts
      const issueDateText =
        t.reports.ifleStudentsNotes.dpfEnglish.data.issueDate;
      const issueDateNowText = formatDate(new Date());
      //issueDate - issueDateTexstWith
      const issueDateTextWith =
        (doc.getStringUnitWidth(issueDateText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const issueDateNowTextWith =
        (doc.getStringUnitWidth(issueDateNowText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const issueDatehRightMarginPosition =
        rightmargin - (issueDateTextWith + issueDateNowTextWith + 2);
      //issueDate - doc.text
      doc.text(issueDateText, issueDatehRightMarginPosition, currentY);
      const issueDateTextWithMargin =
        (doc.getStringUnitWidth(issueDateText) * doc.getFontSize()) /
          doc.internal.scaleFactor +
        issueDatehRightMarginPosition +
        2;
      //issueDate - issueDateNowText - doc.text
      doc.setFont("helvetica", "normal");
      doc.text(issueDateNowText, issueDateTextWithMargin, currentY);
      currentY += 5;

      //Left Side
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
      //Right Side
      //issuedTo
      doc.setFont("helvetica", "bold");
      //issuedTo - texts
      const issuedToText = t.reports.ifleStudentsNotes.dpfEnglish.data.issuedTo;
      const CollegeAbbreviationText =
        studentNotesData.CollegeAbbreviation || "";
      //issuedTo - issuedToTexstWith
      const issuedToTextWith =
        (doc.getStringUnitWidth(issuedToText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const CollegeAbbreviationTextWith =
        (doc.getStringUnitWidth(CollegeAbbreviationText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const issuedTohRightMarginPosition =
        rightmargin - (issuedToTextWith + CollegeAbbreviationTextWith + 2);
      //issuedTo - doc.text
      doc.text(issuedToText, issuedTohRightMarginPosition, currentY);
      const issuedToTextWithMargin =
        (doc.getStringUnitWidth(issuedToText) * doc.getFontSize()) /
          doc.internal.scaleFactor +
        issuedTohRightMarginPosition +
        2;
      //issuedTo - CollegeAbbreviationText - doc.text
      doc.setFont("helvetica", "normal");
      doc.text(CollegeAbbreviationText, issuedToTextWithMargin, currentY);
      currentY += 5;

      //Left Side
      //country
      doc.setFont("helvetica", "bold");
      const countryText = t.reports.ifleStudentsNotes.dpfEnglish.data.country;
      doc.text(countryText, leftmargin, currentY);
      const countryTextWithMargin =
        (doc.getStringUnitWidth(countryText) * doc.getFontSize()) /
          doc.internal.scaleFactor +
        leftmargin +
        2;
      const country = studentNotesData.BirthCountryEn || "";
      doc.setFont("helvetica", "normal");
      doc.text(country, countryTextWithMargin, currentY);
      //Right Side
      //credits
      doc.setFont("helvetica", "bold");
      //credits - texts
      const creditsText = t.reports.ifleStudentsNotes.dpfEnglish.data.credits;
      const creditsValueText = "UNIVERSITARY";
      //credits - creditsTexstWith
      const creditsTextWith =
        (doc.getStringUnitWidth(creditsText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const creditsValueTextWith =
        (doc.getStringUnitWidth(creditsValueText) * doc.getFontSize()) /
        doc.internal.scaleFactor;
      const creditshRightMarginPosition =
        rightmargin - (creditsTextWith + creditsValueTextWith + 2);
      //credits - doc.text
      doc.text(creditsText, creditshRightMarginPosition, currentY);
      const creditsTextWithMargin =
        (doc.getStringUnitWidth(creditsText) * doc.getFontSize()) /
          doc.internal.scaleFactor +
        creditshRightMarginPosition +
        2;
      //credits - creditsValueText - doc.text
      doc.setFont("helvetica", "normal");
      doc.text(creditsValueText, creditsTextWithMargin, currentY);
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
      //secretariatName
      doc.setTextColor(141, 154, 208);
      doc.setFont("helvetica", "normal");
      doc.text(t.reports.ifleStudentsNotes.secretariatName, 160, currentY + 40);
      doc.setTextColor(0, 0, 0);
      currentY += 10;

      //date
      const dateText = t.reports.ifleStudentsNotes.dpfEnglish.date;
      doc.text(
        t.reports.ifleStudentsNotes.dpfEnglish.date,
        leftmargin,
        currentY,
      );
      const dateTextWithMargin =
        (doc.getStringUnitWidth(dateText) * doc.getFontSize()) /
          doc.internal.scaleFactor +
        leftmargin +
        2;
      const date = formatDate(new Date());
      doc.setFont("helvetica", "normal");
      doc.text(date, dateTextWithMargin, currentY);

      //img signatureMarta
      doc.addImage(signatureMarta, "PNG", 140, currentY - 8, 40, 35);
      //img logoCollonge
      doc.addImage(logoCollonge, "PNG", leftmargin, 11, 30, 30);
      //img logoIFLE
      doc.addImage(logoIFLE, "PNG", rightmargin - 30, 10, 30, 30);
      //img tamponeIFLE
      // doc.addImage(tamponIFLE, "PNG", 80, 275, 50, 10);
      doc.addImage(tamponIFLE, "PNG", 60, currentY + 15, 50, 10);

      // // guideLine for the logos /////////////////////////
      // doc.line(leftmargin, 30, leftmargin + 5, 30);
      // doc.line(leftmargin + 5, 10, leftmargin + 5, 43);

      // doc.line(leftmargin + 5, 10, rightmargin - 5, 10);
      // doc.line(leftmargin + 5, 12, rightmargin - 5, 12);
      // doc.line(leftmargin + 5, 32.5, rightmargin - 5, 32.5);
      // doc.line(leftmargin + 5, 43, rightmargin - 5, 43);

      // doc.line(rightmargin - 5, 30, rightmargin, 30);
      // doc.line(rightmargin - 5, 10, rightmargin - 5, 43);
      // // guideLine for the logos /////////////////////////

      // const fileName = `English transcript ${studentName} ${studentNotesData.CourseNotes[0].ScholarYear} ${studentNotesData.CourseNotes[0].Quarter}`;
      const fileName = `Transcript T${studentNotesData.CourseNotes[0].Quarter} ${studentNotesData.CourseNotes[0].ScholarYear}  ${studentName} ${CollegeAbbreviationText}`;
      doc.output("dataurlnewwindow");
      doc.save(fileName);
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
