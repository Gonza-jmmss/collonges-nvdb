// eslint-disable-next-line import/no-anonymous-default-export
export default {
  breadcrumbs: {
    home: "Accueil",
    students: "Étudiants",
    reports: "Rapports",
    ifleStudentsNotes: "Notes des étudiants IFLE",
    settings: "Paramètres",
    users: "Utilisateurs",
    roles: "Rôles",
    modules: "Modules",
    moduleElements: "Éléments du module",
    roleModuleElements: "Éléments du module de rôle",
    courses: "Cours",
    studentCourses: "Cours des étudiant",
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
    welcome: "Bienvenue !",
    shortcut: "Raccourcis",
    logout: "Déconnexion",
    login: "Se connecter",
    create: "Créer",
    edit: "Modifier",
    delete: "Supprimer",
    disable: "Désactiver",
    view: "Visualiser",
    actions: "Actions",
    page: "Page",
    female: "Femelle",
    male: "Mâle",
    enables: "Actifs",
    disables: "Inactifs",
    dateInput: {
      day: "JJ",
      moth: "MM",
      year: "AAAA",
    },
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
      isEnabled: "Actif",
    },
    form: {
      userName: "Nom d'utilisateur",
      password: "Mot de passe",
      repeatePassword: "Répéter le mot de passe",
      role: "Rôle",
      isEnabled: "Utilisateur actif",
    },
    validations: {
      passwordValidation: "Le mot de passe doit contenir au moins 8 lettres",
      repeatPasswordValidation: "Les mots de passe ne correspondent pas",
    },
    notifications: {
      createSuccess: "Utilisateur créé avec succès",
      createError:
        "Une erreur s'est produite pendant la création de l'utilisateur",
      createFailure: "Échec de la création de l'utilisateur",
      updateSuccess: "Utilisateur modifié avec succès",
      updateError:
        "Une erreur s'est produite pendant la modification de l'utilisateur",
      updateFailure: "Échec de la modification de l'utilisateur",
      deleteSuccess: "Utilisateur désactivé avec succès",
      deleteError:
        "Une erreur s'est produite pendant la désactivation de l'utilisateur",
      deleteFailure: "Échec de la désactivation de l'utilisateur",
      updatePasswordSuccess: "Mot de passe modifié avec succès",
      updatePasswordError:
        "Une erreur s'est produite pendant la modification du mot de passe",
      updatePasswordFailure: "Échec de la modification du mot de passe",
    },
    deleteModal: {
      title: "Êtes-vous sûr de désactiver l'utilisateur ?",
      description: "L'utilisateur sera désactivé",
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
      isEnabled: "Actif",
    },
    form: {
      name: "Nom du rôle",
      isEnabled: "Rôle actif",
    },
    notifications: {
      createSuccess: "Rôle créé avec succès",
      createError: "Une erreur s'est produite pendant la création du rôle",
      createFailure: "Échec de la création du rôle",
      updateSuccess: "Rôle modifié avec succès",
      updateError: "Une erreur s'est produite pendant la modification du rôle",
      updateFailure: "Échec de la modification du rôle",
      deleteSuccess: "Rôle désactivé avec succès",
      deleteError: "Une erreur s'est produite pendant la désactivation du rôle",
      deleteFailure: "Échec de la désactivation du rôle",
    },
    deleteModal: {
      title: "Êtes-vous sûr de désactiver le rôle ?",
      description: "Le rôle sera désactivé",
    },
  },
  modules: {
    title: "Modules",
    module: "Module",
    create: "Créer un module",
    columns: {
      moduleId: "ID",
      name: "Module",
      path: "Chemin web",
      icon: "Icône",
      location: "Emplacement",
    },
    form: {
      roleId: "ID",
      name: "Nom du module",
      path: "Chemin web",
      icon: "Icône",
      location: "Emplacement",
    },
    notifications: {
      createSuccess: "Module créé avec succès",
      createError: "Une erreur s'est produite pendant la création du module",
      createFailure: "Échec de la création du module",
      updateSuccess: "Module modifié avec succès",
      updateError:
        "Une erreur s'est produite pendant la modification du module",
      updateFailure: "Échec de la modification du module",
      deleteSuccess: "Module supprimé avec succès",
      deleteError: "Une erreur s'est produite pendant la suppression du module",
      deleteFailure: "Échec de la suppression du module",
    },
    validations: {
      iconValidation: "L'icône n'existe pas",
    },
    deleteModal: {
      title: "Êtes-vous sûr de supprimer le module ?",
      description: "Le module sera définitivement supprimé",
    },
  },
  moduleElements: {
    title: "Éléments du module",
    moduleElement: "Élément du module",
    surnom: "Éléments du module",
    create: "Créer un élément",
    columns: {
      moduleElementId: "ID",
      name: "Éléments du module",
      path: "Chemin web",
      icon: "Icône",
      moduleName: "Module",
      location: "Emplacement",
    },
    form: {
      moduleElementId: "ID",
      name: "Éléments du module",
      path: "Chemin web",
      icon: "Icône",
      description: "Description",
      location: "Emplacement",
      moduleId: "Module",
    },
    notifications: {
      createSuccess: "Élément créé avec succès",
      createError: "Une erreur s'est produite pendant la création de l'élément",
      createFailure: "Échec de la création de l'élément",
      updateSuccess: "Élément modifié avec succès",
      updateError:
        "Une erreur s'est produite pendant la modification de l'élément",
      updateFailure: "Échec de la modification de l'élément",
      deleteSuccess: "Élément supprimé avec succès",
      deleteError:
        "Une erreur s'est produite pendant la suppression de l'élément",
      deleteFailure: "Échec de la suppression de l'élément",
    },
    validations: {
      iconValidation: "L'icône n'existe pas",
    },
    deleteModal: {
      title: "Êtes-vous sûr de supprimer l'élément ?",
      description: "L'élément sera définitivement supprimé",
    },
  },
  roleModuleElements: {
    title: "Éléments du module de rôle",
    roleModuleElement: "Élément du module de rôle",
    create: "Créer un élément de rôle",
    columns: {
      roleModuleElementId: "ID",
      moduleElementName: "Élément du module",
      moduleName: "Module",
      path: "Chemin web",
      roleName: "Rôle",
    },
    form: {
      moduleElementId: "Éléments du module",
      moduleId: "Modules",
      roleId: "Rôle",
      chooseElementType: "Choisir type d'élément",
    },
    notifications: {
      createSuccess: "Élément de rôle créé avec succès",
      createError:
        "Une erreur s'est produite pendant la création de l'élément de rôle",
      createFailure: "Échec de la création de l'élément de rôle",
      updateSuccess: "Élément de rôle modifié avec succès",
      updateError:
        "Une erreur s'est produite pendant la modification de l'élément de rôle",
      updateFailure: "Échec de la modification de l'élément de rôle",
      deleteSuccess: "Élément de rôle supprimé avec succès",
      deleteError:
        "Une erreur s'est produite pendant la suppression de l'élément de rôle",
      deleteFailure: "Échec de la suppression de l'élément de rôle",
    },
    validations: {
      iconValidation: "L'icône n'existe pas",
    },
    deleteModal: {
      title: "Êtes-vous sûr de supprimer l'élément de rôle ?",
      description: "L'élément de rôle sera définitivement supprimé",
    },
  },
  students: {
    pageTitle: "Page des étudiants",
    student: "Étudiant",
    create: "Créer un étudiant",
    columns: {
      id: "ID",
      dBaseCode: "Code DBase",
      studentName: "Nom",
      studentType: "Type d'étudiant",
      isACA: "Est ACA",
      isEnabled: "Actif",
      actions: "Actions",
    },
    form: {
      firstName: "Prénom",
      lastName: "Nom",
      birthDate: "Date de naissance",
      sex: "Sexe",
      telephone: "Téléphone",
      workTelephone: "Téléphone professionnel",
      birthCity: "Ville de naissance",
      address1: "Adresse",
      birthCountryId: "Pays de naissance",
      email: "E-mail",
      dBaseCode: "Code DBase",
      personImage: "Image",
      contactTypeId: "Type de contact",
      studentTypeId: "Type d'étudiant",
      countryId: "Pays",
      contactCity: "Ville",
      isACA: "Est ACA",
      collegeId: "Université",
      regimeId: "Régime",
      isEnabled: "Est activé",
      addContact: "Ajouter un contact",
      contact: "Contact",
      personId: "Nom du contact",
      loadContactData: "Charger les informations",
      selectContact: "Sélectionner un contact",
    },
    validations: {
      sexValidation: "Le champ sexe est obligatoire",
      bithDateValidation: "La date de naissance est obligatoire",
      contactTypeValidation: "Le type de contact est obligatoire",
      countryValidation: "Le pays de naissance est obligatoire",
      regimeValidation: "Le régime est obligatoire",
      contactValidation: "Le contact est obligatoire",
    },
    notifications: {
      createSuccess: "Étudiant créé avec succès",
      createError:
        "Une erreur s'est produite pendant la création de l'étudiant",
      createFailure: "Échec de la création de l'étudiant",
      updateSuccess: "Étudiant modifié avec succès",
      updateError:
        "Une erreur s'est produite pendant la modification de l'étudiant",
      updateFailure: "Échec de la modification de l'étudiant",
      deleteSuccess: "Étudiant désactivé avec succès",
      deleteError:
        "Une erreur s'est produite pendant la désactivation de l'étudiant",
      deleteFailure: "Échec de la désactivation de l'étudiant",
    },
    deleteModal: {
      title: "Êtes-vous sûr de désactiver l'étudiant ?",
      description: "L'étudiant sera désactivé",
    },
  },
  courses: {
    title: "Page des cours",
    course: "Cours",
    create: "Créer un cours",
    columns: {
      courseId: "ID",
      name: "Cours",
      courseCode: "Code cours",
      periodNumber: "Trimestre",
      creditAmount: "Crédits",
      isEnabled: "Est activé",
    },
    form: {
      name: "Nom français",
      englishName: "Nom anglais",
      courseCode: "Code cours",
      creditAmount: "Crédits",
      coursePeriodId: "Type de période",
      periodNumber: "N° Trimestre",
      courseTypeId: "Type de cours",
      isEnabled: "Est activé",
    },
    notifications: {
      createSuccess: "Cours créé avec succès",
      createError: "Une erreur s'est produite pendant la création du cours",
      createFailure: "Échec de la création du cours",
      updateSuccess: "Cours modifié avec succès",
      updateError: "Une erreur s'est produite pendant la modification du cours",
      updateFailure: "Échec de la modification du cours",
      deleteSuccess: "Cours désactivé avec succès",
      deleteError:
        "Une erreur s'est produite pendant la désactivation du cours",
      deleteFailure: "Échec de la désactivation du cours",
    },
    deleteModal: {
      title: "Êtes-vous sûr de désactiver le cours ?",
      description: "Le cours sera désactivé",
    },
  },
  studentCourses: {
    title: "Page des cours des étudiants",
    studentCourse: "Cours des étudiant",
    create: "Créer un cours des étudiants",
    columns: {
      studentId: "ID",
      alternativeName: "Étudiant",
      note: "Note",
      scholarPeriodId: "Période",
      courseId: "Cours ID",
      name: "Cours",
      courseCode: "Code cours",
    },
    form: {
      studentId: "Étudiant",
      studentCourses: "Cours",
      addCourse: "Ajouter cours",
      coursePeriod: "Trimestre",
      scholarPeriodId: "Période",
    },
    validations: {
      studentValidation: "Le étudiant est obligatoire",
      scholarPeriodValidation: "La période scolaire est obligatoire",
      coursesValidation: "Les courses sont obligatoires",
    },
    notifications: {
      createSuccess: "Cours ajoutés de l'étudiant avec succès",
      createError:
        "Une erreur s'est produite pendant l'ajout du cours de l'étudiant",
      createFailure: "Échec de l'ajout du cours de l'étudiant",
      updateSuccess: "Cours modifiés de l'étudiant avec succès",
      updateError:
        "Une erreur s'est produite pendant la modification du cours de l'étudiant",
      updateFailure: "Échec de la modification du cours de l'étudiant",

      // deleteSuccess: "Cours de l'étudiant désactivé avec succès",
      // deleteError:
      //   "Une erreur s'est produite pendant la désactivation du cours de l'étudiant",
      // deleteFailure: "Échec de la désactivation du cours de l'étudiant",
    },
  },
  scholarPeriods: {
    title: "Page des périodes scolaires",
    scholarPeriod: "Période scolaire",
    create: "Créer une période scolaire",
    columns: {
      scholarPeriodId: "ID",
      name: "Période scolaire",
      number: "Nombre",
      fromDate: "À partir de",
      toDate: "Jusqu'à",
      isActive: "Est activé",
      scholarYearName: "Année",
    },
    form: {
      name: "Période scolaire",
      number: "Nombre",
      fromDate: "À partir de",
      toDate: "Jusqu'à",
      isActive: "Est activé",
      scholarYearId: "Année",
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
        address1: "33, Chemin du Pérouzet",
        address2: "74160 Collonges-Sous-Saleve, France",
        titleReport: "Releve Officiel des Cours et des Notes",
        titleWarning:
          "Ce document n'est pas valable sans le timbre sec officiel a empreinte",
        secretariat: "Le secrétariat :",
        date: "Date :",
        data: {
          studentName: "Nom de l'étudiant(e) :",
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
        address1: "33, Chemin du Pérouzet",
        address2: "74160 Collonges-Sous-Saleve, France",
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
