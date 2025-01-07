// eslint-disable-next-line import/no-anonymous-default-export
export default {
  SidebarElements: {
    home: "Accueil",
    homeSegment: "home",
    students: "Etudiants",
    studentsSegment: "students",
    reports: "Rapports",
    reportsSegment: "reports",
    settings: "paramètres",
  },
  breadcrumbs: {
    home: "Accueil",
    students: "Etudiants",
    reports: "Rapports",
    ifleStudentsNotes: "Notes des étudiants IFLE",
    settings: "Paramètres",
    users: "Utilisateurs",
    roles: "Rôles",
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
    login: "Se connecter",
    create: "Créer",
    edit: "Modifier",
    delete: "Supprimer",
    view: "Visualiser",
  },
  login: {
    user: "Utilisateur",
    password: "Mot de passe",
  },
  users: {
    title: "Utilisateurs",
    user: "Utilisateur",
    pageTitle: "Page des utilisateurs",
    create: "Créer un utilisateur",
    columns: {
      userId: "ID",
      userName: "Utilisateur",
      roleName: "Rôle",
    },
    form: {
      userName: "Nom d'utilisateur",
      password: "Mot de passe",
      repeatePassword: "Répéter le mot de passe",
      role: "Rôle",
    },
    notifications: {
      createSuccess: "Utilisateur créé avec succès",
      createError:
        "Une erreur s'est produite pendant la création du utilisateur",
      createFailure: "Échec de la création du utilisateur",
      updateSuccess: "Utilisateur modifié avec succès",
      updateError:
        "Une erreur s'est produite pendant la modification du utilisateur",
      updateFailure: "Échec de la modification du utilisateur",
      deleteSuccess: "Utilisateur supprimé avec succès",
      deleteError:
        "Une erreur s'est produite pendant la suppression du utilisateur",
      deleteFailure: "Échec de la suppression du utilisateur",
      updatePasswordSuccess: "Mots de passe modifié avec succès",
      updatePasswordError:
        "Une erreur s'est produite pendant la modification du mots de passe",
      updatePasswordFailure: "Échec de la modification du mots de passe",
    },
  },
  roles: {
    title: "Rôles",
    role: "Rôle",
    pageTitle: "Page des Rôles",
    create: "Créer un rôle",
    columns: {
      roleId: "ID",
      name: "Nom du rôle",
    },
    form: {
      name: "Nom du rôle",
    },
    notifications: {
      createSuccess: "Rôle créé avec succès",
      createError: "Une erreur s'est produite pendant la création du rôle",
      createFailure: "Échec de la création du rôle",
      updateSuccess: "Rôle modifié avec succès",
      updateError: "Une erreur s'est produite pendant la modification du rôle",
      updateFailure: "Échec de la modification du rôle",
      deleteSuccess: "Rôle supprimé avec succès",
      deleteError: "Une erreur s'est produite pendant la suppression du rôle",
      deleteFailure: "Échec de la suppression du rôle",
    },
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
