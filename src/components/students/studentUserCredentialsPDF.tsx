"use client";

import { Button } from "@/components/ui/button";
import {
  StudentsViewModel,
  FirstCredentialsViewModel,
} from "@/repositories/students/studentsViewModel";
import { Column } from "@/functions/formatTablePDF";
import formatTablePDF from "@/functions/formatTablePDF";
import autoTable from "jspdf-autotable";
import { jsPDF } from "jspdf";
import frFR from "@/lang/fr-FR";

export default function StudentUserCreadentialsPDF({
  studentsData,
}: {
  studentsData: StudentsViewModel[];
}) {
  const t = frFR;

  const columnsToExport: Column<FirstCredentialsViewModel>[] = [
    {
      value: "UserName",
      name: t.students.studentUserCredentialsPDF.columns.information,
      cell: (row: any) =>
        `${t.students.studentUserCredentialsPDF.columns.url}:  ${t.students.studentUserCredentialsPDF.columns.urlValue}\n${t.students.studentUserCredentialsPDF.columns.userName}:  ${row.UserName}\n${t.students.studentUserCredentialsPDF.columns.password}:  ${row.UserFirstName.split(" ")[0]}.${row.StudentId}`,
    },
    {
      value: "UserFirstName",
      name: t.students.studentUserCredentialsPDF.columns.information,
      cell: (row: any) => {
        return row.UserName2
          ? `${t.students.studentUserCredentialsPDF.columns.url}:  ${t.students.studentUserCredentialsPDF.columns.urlValue}\n${t.students.studentUserCredentialsPDF.columns.userName}:  ${row.UserName2}\n${t.students.studentUserCredentialsPDF.columns.password}:  ${row.UserFirstName2.split(" ")[0]}.${row.StudentId2}`
          : "";
      },
    },
  ];

  const studentNotesDataForPdf: FirstCredentialsViewModel[] = [
    ...studentsData
      .map((x) => x.FirstCredentials)
      .filter((x) => x.UserName !== null),
  ];

  const transformDataForTwoColumns = (data: FirstCredentialsViewModel[]) => {
    const transformedData = [];

    for (let i = 0; i < data.length; i += 2) {
      const firstStudent = data[i];
      const secondStudent = data[i + 1];

      const row: any = {
        UserName: firstStudent.UserName,
        UserFirstName: firstStudent.UserFirstName,
        StudentId: firstStudent.StudentId,
      };

      // Add second student data if exists
      if (secondStudent) {
        row.UserName2 = secondStudent.UserName;
        row.UserFirstName2 = secondStudent.UserFirstName;
        row.StudentId2 = secondStudent.StudentId;
      }

      transformedData.push(row);
    }

    return transformedData;
  };

  const exportToPDF = () => {
    try {
      const transformedData = transformDataForTwoColumns(
        studentNotesDataForPdf,
      );
      const tablePDF = formatTablePDF(columnsToExport, transformedData);
      const doc = new jsPDF("p", "mm", "a4");
      let currentY = 14; // Start position for content

      doc.setTextColor(0, 0, 0);
      doc.setFont("helvetica", "bold");

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
        styles: { textColor: "#000000", fontSize: 10, cellPadding: 10 },
        columnStyles: {
          Quarter: { halign: "center" },
          CreditAmount: { halign: "center" },
          Note: { halign: "center" },
        },
      });

      const fileName = `Information d'authentification des étudiants ${studentsData[0].YearPeriodName}`;
      doc.output("dataurlnewwindow");
      doc.save(fileName);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Button variant="outlineColored" onClick={() => exportToPDF()}>
      {t.students.studentUserCredentialsPDF.button}
    </Button>
  );
}
