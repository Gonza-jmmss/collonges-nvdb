import { columns } from "mssql";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  shared: {
    save: "Save",
    cancel: "Cancel",
    yes: "Yes",
    no: "No",
    exportPDF: "Export PDF",
  },
  student: {
    pageTitle: "Students page",
    student: "Student",
    columns: {
      id: "ID",
      dBaseCode: "DBase Code",
      studentName: "Name",
      studentType: "Student type",
      isACA: "Is ACA",
      actions: "Actions",
    },
  },
  reports: {
    pageTitle: "Reports",
    ifleStudentsNotes: {
      title: "IFLE Students Notes",
      data: {
        studentName: "Student name",
        birthdate: "Birthdate",
        place: "Place",
        country: "Country",
        emissionDate: "Emission date",
        studentId: "No ID",
      },
      columns: {
        courseCode: "No. Cours",
        coursName: "Cours Name",
        scholarYear: "Scholar Year",
        creditAmount: "Credits",
        note: "Note/20",
        quarter: "Quarter",
      },
    },
  },
};
