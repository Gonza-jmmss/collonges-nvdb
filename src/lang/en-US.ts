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
      titlePage: "IFLE Students Notes of",
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
      dpf: {
        titleInstitute: "Institut de francais langue etrangere",
        nomCampus: "Campus Adventiste du Saleve",
        bp74: "B. P. 74",
        address: "74165 Collonges-Sous-Saleve Cedex, France",
        titleReport: "Releve Officiel des Cours et des Notes",
        titleWarning:
          "Ce document n'est pas valable sans le timbre sec officiel a empreinte",
        secretariat: "Le secrétariat :",
        date: "Date :",
        data: {
          studentName: "Nom de l'etudiant(e) :",
          dbaseId: "No ID :",
          birthdate: "Né(e) le :",
          emitionDate: "Date d'émission du relevé :",
          place: "Lieu :",
          country: "Pays :",
        },
        dataEnglish: {
          studentName: "Student Name :",
          dbaseId: "No ID :",
          birthdate: "Birthdate :",
          emitionDate: "Emition Date :",
          place: "Place :",
          country: "Country :",
        },
        columns: {
          scholarYear: "Année",
          quarter: "Tr.",
          courseCode: "No cours",
          coursName: "Nom des cours",
          creditAmount: "Valeur",
          note: "Note/20",
        },
        text: {
          title: "Notes :",
          noteText:
            "I = Incomplet, W = Retrait des cours, P = Passable U = Nom satisfaisant, AU = Auditeur, F = Echec",
          descText:
            "Une unité de valeur équivaut à une heure de cours par semaine pendant un trimestre",
        },
      },
    },
  },
};
