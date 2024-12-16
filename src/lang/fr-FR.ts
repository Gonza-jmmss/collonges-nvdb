import { Breadcrumb } from "@/components/ui/breadcrumb";

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  SidebarElements: {
    home: "Accueil",
    homeSegment: "home",
    students: "Etudiants",
    studentsSegment: "students",
    reports: "Rapports",
    reportsSegment: "reports",
  },
  breadcrumbs: {
    home: "Accueil",
    students: "Etudiants",
    reports: "Rapports",
    ifleStudentsNotes: "Notes des étudiants IFLE",
  },
  shortcuts: {
    transcripts: "Transcripts",
  },
  shared: {
    save: "Enregistrer",
    cancel: "Annuler",
    yes: "Oui",
    no: "Non",
    exportPDF: "Exporter en PDF",
    welcome: "Bienvenu !",
    shortcut: "Raccourcis",
    logout: "Déconnexion",
  },
  student: {
    pageTitle: "Page des étudiants",
    student: "Étudiant",
    columns: {
      id: "ID",
      dBaseCode: "Code DBase",
      studentName: "Nom",
      studentType: "Type d'étudiant",
      isACA: "Est ACA",
      actions: "Actions",
    },
  },
  reports: {
    pageTitle: "Rapports",
    ifleStudentsNotes: {
      title: "Notes des étudiants IFLE",
      titlePage: "Notes des étudiants IFLE de",
      secretariatName: "Marta Oliver",
      data: {
        studentName: "Nom de l'étudiant",
        birthdate: "Date de naissance",
        place: "Lieu",
        country: "Pays",
        emissionDate: "Date d'émission",
        studentId: "N° ID",
      },
      columns: {
        courseCode: "N° Cours",
        coursName: "Nom du cours",
        scholarYear: "Année scolaire",
        creditAmount: "Crédits",
        note: "Note/20",
        americanNote: "Américaine",
        quarter: "Trimestre",
      },
      dpfFrench: {
        exportPDF: "French PDF",
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
          dbaseId: "N° ID :",
          birthdate: "Né(e) le :",
          issueDate: "Date d'émission du relevé :",
          place: "Lieu :",
          country: "Pays :",
        },
        columns: {
          scholarYear: "Année",
          quarter: "Tr.",
          courseCode: "N° cours",
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
      dpfEnglish: {
        exportPDF: "American PDF",
        titleInstitute: "Institut de francais langue etrangere",
        nomCampus: "Campus Adventiste du Saleve",
        bp74: "B. P. 74",
        address: "74165 Collonges-Sous-Saleve Cedex, France",
        titleReport: "Official transcript of records",
        titleWarning: "Not valid without the official embossed stamp",
        secretariat: "The Registrar :",
        date: "Date :",
        data: {
          studentName: "Student's name :",
          dbaseId: "N° ID :",
          birthdate: "Birth date :",
          issueDate: "Date of issue :",
          dateFormat: "(dd/mm/yy)",
          place: "Place :",
          country: "Country :",
          issuedTo: "Transcript issued to :",
          credits: "Credits :",
        },
        columns: {
          scholarYear: "Year/Quart.",
          courseCode: "Course N°",
          coursName: "Title",
          creditAmount: "Credit Hours",
          note: "Grade",
        },
        text: {
          title: "Grades :",
          noteText1:
            "A = Superior, B = Above average, C = Average, D = Below average, F = Failure, I = Incomplete",
          noteText2:
            "AU = Auditor, W = Withdrawal, P = Passing, U = Non satisfactory.",
          descText:
            "One quarter credit is equivalent to one hour of class per week. Dates are DD/MM/YY.",
        },
      },
    },
  },
};
