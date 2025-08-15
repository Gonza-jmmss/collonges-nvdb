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
    roleModuleElements: "Permissions de rôle",
    courses: "Cours",
    studentCourses: "Cours des étudiants",
    scholarPeriods: "Périodes scolaires",
    scholarYears: "Années scolaires",
    levels: "Niveaux scolaires",
    teacherCourses: "Cours de professeur",
    gradeCoefficients: "Coefficients de note",
    studentCourseGrades: "Notes",
    yearPeriods: "Périodes d'année",
    contactTypes: "Types de contacts",
    changePassword: "Modifier le mot de passe",
    studentCourseAttendances: "Assiduité",
    studentHome: "Accueil",
    grades: "Notes",
    attendances: "Assiduité",
    courseTextbooks: "Cahier de texte",
  },
  shortcuts: {
    transcripts: "Relevés de notes",
    grades: "Notes",
    courses: "Cours",
    students: "Étudiants",
  },
  shared: {
    save: "Enregistrer",
    cancel: "Annuler",
    confirm: "Confirmer",
    yes: "Oui",
    no: "Non",
    exportPDF: "Exporter en PDF",
    welcome: "Bienvenue à ClassIFLE !",
    shortcut: "Raccourcis",
    logout: "Déconnexion",
    login: "Connexion",
    create: "Créer",
    edit: "Modifier",
    delete: "Supprimer",
    disable: "Désactiver",
    view: "Visualiser",
    actions: "Actions",
    page: "Page",
    female: "Féminin",
    male: "Masculin",
    enables: "Actifs",
    disables: "Inactifs",
    other: "Autre",
    dateInput: {
      day: "JJ",
      month: "MM",
      year: "AAAA",
      dateInput: "Date",
    },
    noValues: "Aucune valeur trouvée.",
    changePassword: {
      title: "Modifier le mot de passe",
    },
  },
  login: {
    title: "Connectez-vous",
    user: "Utilisateur",
    password: "Mot de passe",
  },
  table: {
    noResults: "Aucun résultat.",
    columns: "Colonnes",
    page: "Page",
    of: "de",
    goToPage: "| Aller à la page : ",
    totalRows: "Résultats ",
    searchAllColumns: "Rechercher toutes les colonnes...",
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
    toggle: {
      student: "Étudiants",
      others: "Autres",
    },
    form: {
      userName: "Nom d'utilisateur",
      password: "Mot de passe",
      repeatPassword: "Répéter le mot de passe",
      role: "Rôle",
      isEnabled: "Utilisateur actif",
    },
    validations: {
      passwordValidation: "Le mot de passe doit contenir au moins 8 caractères",
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
      title: "Êtes-vous sûr de vouloir désactiver l'utilisateur ?",
      description: "L'utilisateur sera désactivé",
    },
  },
  roles: {
    title: "Rôles",
    role: "Rôle",
    pageTitle: "Page des rôles",
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
      disableSuccess: "Rôle désactivé avec succès",
      disableError:
        "Une erreur s'est produite pendant la désactivation du rôle",
      disableFailure: "Échec de la désactivation du rôle",
    },
    deleteModal: {
      title: "Êtes-vous sûr de supprimer le rôle ?",
      description: "Le rôle sera définitivement supprimé",
      disableTitle: "Êtes-vous sûr de vouloir désactiver le rôle?",
      disableDescription: "Le rôle sera désactivé",
    },
    deleteModalValidation: {
      title: "Le rôle a des utilisateurs assignées",
      description:
        "Les rôles avec des utilisateurs assignés ne peuvent pas être supprimées",
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
      title: "Êtes-vous sûr de vouloir supprimer le module ?",
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
      name: "Nom de l'élément",
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
      title: "Êtes-vous sûr de vouloir supprimer l'élément ?",
      description: "L'élément sera définitivement supprimé",
    },
  },
  roleModuleElements: {
    title: "Permissions de rôle",
    roleModuleElement: "Permission de rôle",
    create: "Ajouter des permissions de rôle",
    columns: {
      roleModuleElementId: "ID",
      moduleElementName: "Élément du module",
      moduleName: "Module",
      path: "Chemin web",
      roleName: "Rôle",
      icon: "Icône",
      isShortcut: "Est raccourci",
    },
    form: {
      moduleElementId: "Éléments du module",
      moduleId: "Modules",
      roleId: "Rôle",
      chooseElementType: "Choisir le type d'élément",
      isShortCut: "Est raccourci",
    },
    notifications: {
      createSuccess: "Permissions de rôle créées avec succès",
      createError:
        "Une erreur s'est produite lors de la création des permissions de rôle",
      createFailure: "Échec de la création des permissions de rôle",
      updateSuccess: "Permissions de rôle modifiées avec succès",
      updateError:
        "Une erreur s'est produite lors de la modification des permissions de rôle",
      updateFailure: "Échec de la modification des permissions de rôle",
      deleteSuccess: "Permissions de rôle supprimées avec succès",
      deleteError:
        "Une erreur s'est produite lors de la suppression des permissions de rôle",
      deleteFailure: "Échec de la suppression des permissions de rôle",
    },
    validations: {
      roleValidation: "Le rôle est obligatoire",
    },
    deleteModal: {
      title: "Êtes-vous sûr de vouloir supprimer ces permissions ?",
      description: "Les permissions de rôle seront définitivement supprimées",
    },
  },
  students: {
    pageTitle: "Page des étudiants",
    student: "Étudiant(e)",
    create: "Créer un étudiant",
    columns: {
      id: "ID",
      dBaseCode: "Code DBase",
      studentName: "Nom",
      studentType: "Type d'étudiant",
      isACA: "Est ACA",
      isEnabled: "Actif",
      actions: "Actions",
      yearPeriodName: "Période d'année",
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
      isEnabled: "Actif",
      yearPeriodId: "Période d'année",
      creditsType: "Type de crédits",
      addContact: "Ajouter un contact",
      contact: "Contact",
      personId: "Nom du contact",
      loadContactData: "Charger les informations",
      selectContact: "Sélectionner un contact",
      addPersonCountry: "Ajouter une nationalité",
      personCountry: "Nationalités",
      noCollegText: "Sans université",
    },
    validations: {
      sexValidation: "Le champ sexe est obligatoire",
      birthDateValidation: "La date de naissance est obligatoire",
      contactTypeValidation: "Le type de contact est obligatoire",
      countryValidation: "Le pays de naissance est obligatoire",
      nationalityValidation: "Le pays de nationalité est obligatoire",
      regimeValidation: "Le régime est obligatoire",
      contactValidation: "Le contact est obligatoire",
      yearPeriodValidation: "La période d'année est obligatoire",
    },
    notifications: {
      createSuccess: "Étudiant(e) créé avec succès",
      createError:
        "Une erreur s'est produite pendant la création de l'étudiant(e)",
      createFailure: "Échec de la création de l'étudiant(e)",
      updateSuccess: "Étudiant(e) modifié avec succès",
      updateError:
        "Une erreur s'est produite pendant la modification de l'étudiant(e)",
      updateFailure: "Échec de la modification de l'étudiant(e)",
      deleteSuccess: "Étudiant(e) désactivé avec succès",
      deleteError:
        "Une erreur s'est produite pendant la désactivation de l'étudiant(e)",
      deleteFailure: "Échec de la désactivation de l'étudiant(e)",
      studentUserCreateSuccess:
        "L'utilisateur de l'étudiant(e) a été créé avec succès",
      studentUserCreateError:
        "Une erreur s'est produite pendant la création de l'utilisateur de l'étudiant(e)",
      studentUserCreateFailure:
        "Échec de la création de l'utilisateur de l'étudiant(e)",
    },
    deleteModal: {
      title: "Êtes-vous sûr de vouloir désactiver l'étudiant(e) ?",
      description: "L'étudiant(e) sera désactivé",
    },
    createStudentUserModal: {
      title: "Êtes-vous sûr de vouloir créer un utilisateur pour",
      description:
        "Cela créera un utilisateur afin que l'étudiant puisse voir ses notes",
    },
    studentUserCredentialsPDF: {
      button: "Identifiants PDF",
      columns: {
        information: "Identifiants",
        url: "URL",
        urlValue: "http://srvifle:3128",
        userName: "Nom d'utilisateur",
        password: "Mot de passe",
      },
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
      isEnabled: "Actif",
    },
    form: {
      name: "Nom français",
      englishName: "Nom anglais",
      courseCode: "Code cours",
      creditAmount: "Crédits",
      coursePeriodId: "Type de période",
      periodNumber: "N° Trimestre",
      courseTypeId: "Type de cours",
      isEnabled: "Actif",
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
      title: "Êtes-vous sûr de vouloir désactiver le cours ?",
      description: "Le cours sera désactivé",
    },
  },
  studentCourses: {
    title: "Page des cours des étudiants",
    studentCourse: "Cours de l'étudiant(e)",
    create: "Ajouter des cours",
    columns: {
      studentId: "ID",
      coursesAsigned: "Cours attribués",
      alternativeName: "Étudiant(e)",
      isEnabled: "Actif",
      note: "Note",
      scholarPeriodId: "Période",
      courseId: "Cours ID",
      name: "Cours",
      courseCode: "Code cours",
    },
    filters: {
      scholarYearId: "Année scolaire",
      scholarPeriodId: "Période",
      scholarLevelId: "Niveau scolaire",
    },
    form: {
      studentId: "Étudiant(e)",
      studentCourses: "Cours",
      addCourse: "Ajouter un cours",
      scholarLevels: "Niveau scolaire",
      courses: "Cours",
      coursePeriod: "Trimestre",
      scholarPeriodId: "Période",
      scholarYearId: "Année scolaire",
    },
    validations: {
      studentValidation: "L'étudiant est obligatoire",
      scholarPeriodValidation: "La période scolaire est obligatoire",
      coursesValidation: "Les cours sont obligatoires",
    },
    notifications: {
      createSuccess: "Cours ajoutés pour l'étudiant(e) avec succès",
      createError:
        "Une erreur s'est produite pendant l'ajout des cours de l'étudiant(e)",
      createFailure: "Échec de l'ajout du cours de l'étudiant(e)",
      updateSuccess: "Cours modifiés pour l'étudiant(e) avec succès",
      updateError:
        "Une erreur s'est produite pendant la modification du cours de l'étudiant(e)",
      updateFailure: "Échec de la modification du cours de l'étudiant(e)",

      // deleteSuccess: "Cours de l'étudiant désactivé avec succès",
      // deleteError:
      //   "Une erreur s'est produite pendant la désactivation du cours de l'étudiant",
      // deleteFailure: "Échec de la désactivation du cours de l'étudiant",
    },
    confirmationModal: {
      title:
        "Êtes-vous sûr de vouloir supprimer un cours contenant des notes ajoutées ?",
      description:
        "La suppression du cours effacera définitivement toutes les notes de ce cours pour l'étudiant",
    },
  },
  scholarPeriods: {
    title: "Page des périodes scolaires",
    scholarPeriod: "Période scolaire",
    create: "Créer une période scolaire",
    warningActivePeriods:
      "Plusieurs périodes sont actives, cela entraînera de graves problèmes",
    columns: {
      scholarPeriodId: "ID",
      name: "Période scolaire",
      number: "Trimestre",
      fromDate: "À partir de",
      toDate: "Jusqu'à",
      isActive: "Actif",
      scholarYearName: "Année",
    },
    form: {
      name: "Nom de la période scolaire",
      number: "Trimestre",
      fromDate: "À partir de",
      toDate: "Jusqu'à",
      isActive: "Actif",
      scholarYearId: "Année",
    },
    notifications: {
      createSuccess: "Période scolaire créée avec succès",
      createError:
        "Une erreur s'est produite pendant la création de la période scolaire",
      createFailure: "Échec de la création de la période scolaire",
      updateSuccess: "Période scolaire modifiée avec succès",
      updateError:
        "Une erreur s'est produite pendant la modification de la période scolaire",
      updateFailure: "Échec de la modification de la période scolaire",
      deleteSuccess: "Période scolaire supprimée avec succès",
      deleteError:
        "Une erreur s'est produite pendant la suppression de la période scolaire",
      deleteFailure: "Échec de la suppression de la période scolaire",
      disableSuccess: "Période scolaire désactivée avec succès",
      disableError:
        "Une erreur s'est produite pendant la désactivation de la période scolaire",
      disableFailure: "Échec de la désactivation de la période scolaire",
    },
    deleteModal: {
      title: "Êtes-vous sûr de vouloir supprimer la période scolaire ?",
      description: "La période scolaire sera supprimée",
      disableTitle: "Êtes-vous sûr de vouloir désactiver la période scolaire ?",
      disableDescription: "La période scolaire sera désactivée",
    },
    deleteModalValidation: {
      title: "La période scolaire a des cours assignés",
      description:
        "Les périodes scolaires avec des cours attribués ne peuvent pas être supprimées",
    },
  },
  scholarYears: {
    title: "Page des années scolaires",
    scholarYear: "Année scolaire",
    create: "Créer une année scolaire",
    warningActiveYears:
      "Plusieurs années sont actives, cela entraînera de graves problèmes",
    columns: {
      scholarYearId: "ID",
      name: "Année scolaire",
      fromDate: "À partir de",
      toDate: "Jusqu'à",
      isActive: "Actif",
    },
    form: {
      name: "Année scolaire",
      fromDate: "À partir de",
      toDate: "Jusqu'à",
      isActive: "Actif",
    },
    notifications: {
      createSuccess: "Année scolaire créée avec succès",
      createError:
        "Une erreur s'est produite pendant la création de l'année scolaire",
      createFailure: "Échec de la création de l'année scolaire",
      updateSuccess: "Année scolaire modifiée avec succès",
      updateError:
        "Une erreur s'est produite pendant la modification de l'année scolaire",
      updateFailure: "Échec de la modification de l'année scolaire",
      deleteSuccess: "Année scolaire supprimée avec succès",
      deleteError:
        "Une erreur s'est produite pendant la suppression de l'année scolaire",
      deleteFailure: "Échec de la suppression de l'année scolaire",
    },
    deleteModal: {
      title: "Êtes-vous sûr de vouloir supprimer l'année scolaire ?",
      description: "L'année scolaire sera supprimée",
      disableTitle: "Êtes-vous sûr de vouloir désactiver l'année scolaire ?",
      disableDescription: "L'année scolaire sera désactivée",
    },
    deleteModalValidation: {
      title: "L'année scolaire a des périodes assignés",
      description:
        "Les années scolaires avec des périodes assignés ne peuvent pas être supprimées",
    },
  },
  levels: {
    title: "Page des niveaux scolaires",
    levels: "Niveaux scolaires",
    create: "Créer un niveau scolaire",
    columns: {
      coursesAsigned: "Cours attribués",
      name: "Niveau scolaire",
      isEnabled: "Actif",
      periodName: "Trimestre",
    },
    expanded: {
      courseName: "Cours",
      courseCode: "Code cours",
    },
    form: {
      name: "Niveau scolaire",
      isEnabled: "Actif",
      levelCourses: "Cours",
      addCourse: "Ajouter un cours",
      scholarPeriodId: "Période",
      periodNumber: "Trimestre",
    },
    validations: {
      coursesValidation: "Les cours sont obligatoires",
      periodNumberValidation: "Le trimestre est obligatoire",
    },
    notifications: {
      createSuccess: "Niveau scolaire créé avec succès",
      createError:
        "Une erreur s'est produite pendant la création du niveau scolaire",
      createFailure: "Échec de la création du niveau scolaire",
      updateSuccess: "Niveau scolaire modifié avec succès",
      updateError:
        "Une erreur s'est produite pendant la modification du niveau scolaire",
      updateFailure: "Échec de la modification du niveau scolaire",
      deleteSuccess: "Niveau scolaire supprimé avec succès",
      deleteError:
        "Une erreur s'est produite pendant la suppression du niveau scolaire",
      deleteFailure: "Échec de la suppression du niveau scolaire",
      disableSuccess: "Niveau scolaire désactivé avec succès",
      disableError:
        "Une erreur s'est produite pendant la désactivation du niveau scolaire",
      disableFailure: "Échec de la désactivation du niveau scolaire",
    },
    deleteModal: {
      deleteTitle: "Êtes-vous sûr de vouloir supprimer le niveau scolaire ?",
      deleteDescription: "Le niveau scolaire sera supprimé",
      disableTitle: "Êtes-vous sûr de vouloir désactiver le niveau scolaire ?",
      disableDescription: "Le niveau scolaire sera désactivé",
    },
    deleteModalValidation: {
      title: "Le niveau scolaire a des cours attribués",
      description:
        "Les niveaux scolaires avec des cours attribués ne peuvent pas être supprimés",
    },
  },
  teacherCourses: {
    title: "Page des cours de professeur(e)",
    teacherCourses: "Cours de professeur(e)",
    columns: {
      coursesAsigned: "Cours attribués",
      userName: "Professeur(e)",
      isEnabled: "Actif",
    },
    expanded: {
      name: "Cours",
      courseCode: "Code cours",
      creditAmount: "Crédits",
    },
    form: {
      teacherCourses: "Cours",
      addCourse: "Ajouter un cours",
      coursePeriod: "Trimestre",
      level: "Niveau scolaire",
      scholarPeriodId: "Période",
    },
    notifications: {
      updateSuccess: "Cours de professeur(e) modifié avec succès",
      updateError:
        "Une erreur s'est produite pendant la modification des cours de professeur(e)",
      updateFailure: "Échec de la modification des cours de professeur(e)",
    },
  },
  gradeCoefficients: {
    title: "Page des coefficients de note",
    gradeCoefficients: "Coefficients de note",
    gradeCoefficient: "Coefficient de note",
    create: "Créer un coefficient de note",
    columns: {
      name: "Coefficients de note",
      coefficient: "Pourcentage",
      isEnabled: "Actif",
    },
    form: {
      name: "Coefficients de note",
      coefficient: "Pourcentage",
      isEnabled: "Actif",
    },
    notifications: {
      createSuccess: "Coefficient de note créé avec succès",
      createError:
        "Une erreur s'est produite pendant la création du coefficient de note",
      createFailure: "Échec de la création du Coefficient de note",
      updateSuccess: "Coefficient de note modifié avec succès",
      updateError:
        "Une erreur s'est produite pendant la modification du coefficient de note",
      updateFailure: "Échec de la modification du coefficient de note",
      deleteSuccess: "Coefficient de note supprimé avec succès",
      deleteError:
        "Une erreur s'est produite pendant la suppression du coefficient de note",
      deleteFailure: "Échec de la suppression du coefficient de note",
      disableSuccess: "Coefficient de note désactivé avec succès",
      disableError:
        "Une erreur s'est produite pendant la désactivation du coefficient de note",
      disableFailure: "Échec de la désactivation du coefficient de note",
    },
    deleteModal: {
      deleteTitle:
        "Êtes-vous sûr de vouloir supprimer le coefficient de note ?",
      deleteDescription: "Le coefficient de note sera supprimé",
      disableTitle:
        "Êtes-vous sûr de vouloir désactiver le coefficient de note ?",
      disableDescription: "Le coefficient de note sera désactivé",
    },
  },
  studentCourseGrades: {
    title: "Page des notes",
    studentCourseGrades: "Notes",
    create: "Ajouter des notes",
    level: "Niveau scolaire",
    tabs: {
      orderedByActivity: "Trié par activité",
      orderedByStudent: "Trié par étudiant",
    },
    columnsByStudent: {
      courseName: "Cours",
      courseCode: "Code du cours",
      studentName: "Étudiant(e)",
      grade: "Moyenne",
      levelName: "Niveau",
    },
    expandedByStudent: {
      description: "Activité",
      gradeCoefficientName: "Type",
      grade: "Note",
      activityDate: "Date",
      userName: "Professeur(e)",
    },
    columnsByActivity: {
      description: "Activité",
      gradeCoefficientName: "Type",
      activityDate: "Date",
      userName: "Professeur(e)",
      levelName: "Niveau",
    },
    expandedByActivity: {
      studentName: "Étudiant(e)",
      averageGrade: "Moyenne de l'étudiant(e)",
      grade: "Note de l'activité",
    },
    form: {
      course: "Cours",
      level: "Niveau scolaire",
      gradeCoefficientId: "Type d'activité",
      description: "Description",
      students: "Étudiants",
      grade: "Note",
      clearGrades: "Effacer notes",
    },
    notifications: {
      createSuccess: "Notes créées avec succès",
      createError: "Une erreur s'est produite pendant la création des notes",
      createFailure: "Échec de la création des notes",
      updateSuccess: "Notes modifiées avec succès",
      updateError:
        "Une erreur s'est produite pendant la modification des notes",
      updateFailure: "Échec de la modification des notes",
      deleteSuccess: "Notes supprimées avec succès",
      deleteError: "Une erreur s'est produite pendant la suppression des notes",
      deleteFailure: "Échec de la suppression des notes",
    },
    validations: {
      gradeCoefficientValidation: "Le coefficient de note est obligatoire",
      coursesValidation: "Les cours sont obligatoires",
    },
    deleteModalValidation: {
      title: "L'activité a des notes assignés",
      description:
        "Pour supprimer l'activité, vous devez d'abord effacer toutes les notes, puis revenir et supprimer l'activité",
    },
    deleteModal: {
      deleteTitle: "Êtes-vous sûr de vouloir supprimer les notes ?",
      deleteDescription: "L'activité sera supprimé",
    },
    confirmtionModal: {
      title:
        "Êtes-vous sûr de vouloir sauvegarder une activité avec toutes ses notes vides ?",
      description:
        "L'activité sera sauvegardée sans notes, mais cela n'affectera pas la moyenne des notes",
      // "L'activité sera sauvegardée sans notes",
    },
  },
  yearPeriods: {
    title: "Page des périodes d'année",
    yearPeriod: "Période d'année",
    create: "Créer une période d'année",
    columns: {
      name: "Période",
      periodType: "Type de période",
      scholarYearName: "Année",
      isEnabled: "Actif",
    },
    form: {
      name: "Période",
      periodType: "Type de période",
      scholarYearId: "Année",
      isEnabled: "Actif",
    },
    validations: {
      periodTypeValidation: "Le type de période est obligatoire",
      scholarYearValidation: "L'année est obligatoire",
    },
    notifications: {
      createSuccess: "Période d'année créée avec succès",
      createError:
        "Une erreur s'est produite pendant la création de la période d'année",
      createFailure: "Échec de la création de la période d'année",
      updateSuccess: "Période d'année modifiée avec succès",
      updateError:
        "Une erreur s'est produite pendant la modification de la période d'année",
      updateFailure: "Échec de la modification de la période d'année",
      deleteSuccess: "Période d'année supprimée avec succès",
      deleteError:
        "Une erreur s'est produite pendant la suppression de la période d'année",
      deleteFailure: "Échec de la suppression de la période d'année",
      disableSuccess: "Période d'année désactivée avec succès",
      disableError:
        "Une erreur s'est produite pendant la désactivation de la période d'année",
      disableFailure: "Échec de la désactivation de la période d'année",
    },
    deleteModal: {
      title: "Êtes-vous sûr de vouloir supprimer la période d'année ?",
      description: "La période d'année sera supprimée",
      disableTitle: "Êtes-vous sûr de vouloir désactiver la période d'année ?",
      disableDescription: "La période d'année sera désactivée",
    },
    deleteModalValidation: {
      title: "La période d'année a des étudiants assignées",
      description:
        "Les périodes d'année avec des étudiants assignés ne peuvent pas être supprimées",
    },
  },
  contactTypes: {
    title: "Page des types de contacts",
    contactType: "Type de contact",
    create: "Créer un type de contact",
    columns: {
      name: "Type de contact",
    },
    form: {
      name: "Type de contact",
    },
    notifications: {
      createSuccess: "Type de contact créé avec succès",
      createError:
        "Une erreur s'est produite pendant la création du type de contact",
      createFailure: "Échec de la création du type de contact",
      updateSuccess: "Type de contact modifié avec succès",
      updateError:
        "Une erreur s'est produite pendant la modification du type de contact",
      updateFailure: "Échec de la modification du type de contact",
      deleteSuccess: "Type de contact supprimé avec succès",
      deleteError:
        "Une erreur s'est produite pendant la suppression du type de contact",
      deleteFailure: "Échec de la suppression du type de contact",
    },
    deleteModal: {
      title: "Êtes-vous sûr de vouloir supprimer le type de contact ?",
      description: "Le type de contact sera supprimé",
    },
    deleteModalValidation: {
      title: "Le type de contact a des contacts assignés",
      description:
        "Le type de contact avec des contacts assignés ne peuvent pas être supprimés",
    },
  },
  colleges: {
    title: "Page des universités",
    college: "Université",
    create: "Créer une université",
    columns: {
      name: "Université",
      abbreviation: "Abréviation",
    },
    form: {
      name: "Université",
      abbreviation: "Abréviation",
    },
    notifications: {
      createSuccess: "Université créée avec succès",
      createError:
        "Une erreur s'est produite pendant la création de l'université",
      createFailure: "Échec de la création de l'université",
      updateSuccess: "Université modifiée avec succès",
      updateError:
        "Une erreur s'est produite pendant la modification de l'université",
      updateFailure: "Échec de la modification de l'université",
      deleteSuccess: "Université supprimée avec succès",
      deleteError:
        "Une erreur s'est produite pendant la suppression de l'université",
      deleteFailure: "Échec de la suppression de l'université",
    },
    deleteModal: {
      title: "Êtes-vous sûr de vouloir supprimer l'université ?",
      description: "L'université sera supprimée",
    },
    deleteModalValidation: {
      title: "L'université a des étudiants assignés",
      description:
        "Les universités avec des étudiants assignés ne peuvent pas être supprimées",
    },
  },
  studentCourseAttendances: {
    title: "Page d'assiduité",
    studentCourseAttendance: "Assiduité",
    create: "Créer une Assiduité",
    tabs: {
      orderedByDay: "Trié par jour",
      orderedByStudent: "Trié par étudiant",
    },
    columnsByDay: {
      levelName: "Nuveau",
    },
    columnsByDayExtended: {
      courseCode: "Code du cours",
      courseName: "Cours",
      teacher: "Professeur(e)",
      attendancePeriod: "Période",
    },
    columnsByStudent: {
      studentName: "Étudiant",
    },
    columnsByStudentExtended: {
      courseCode: "Code du cours",
      courseName: "Cours",
      attendanceScore: "Absence",
    },
    form: {
      course: "Cours",
      periodNumber: "Trimestre",
      level: "Niveau scolaire",
      attendanceDate: "Date",
      students: "Étudiants",
      attendancePeriod: "Période",
    },
    validations: {
      attendanceDateValidation: "La date est obligatoire",
      studentCourseAttendancesValidation:
        "Il est obligatoire d'avoir des étudiants",
      attendanceValueValidation: "L'assiduité est obligatoire",
      attendancePeriodValidation: "La période est obligatiore",
    },
    notifications: {
      createSuccess: "Assiduité créée avec succès",
      createError:
        "Une erreur s'est produite pendant la création de l'assiduité",
      createFailure: "Échec de la création de l'assiduité",
      updateSuccess: "Assiduité modifiée avec succès",
      updateError:
        "Une erreur s'est produite pendant la modification de l'assiduité",
      updateFailure: "Échec de la modification de l'Assiduité",
      deleteSuccess: "Assiduité supprimée avec succès",
      deleteError:
        "Une erreur s'est produite pendant la suppression de l'assiduité",
      deleteFailure: "Échec de la suppression de l'assiduité",
    },
    deleteModal: {
      title: "Êtes-vous sûr de vouloir supprimer l'assiduité ?",
      description: "L'assiduité sera supprimée",
    },
    deleteModalValidation: {
      title: "L'assiduité a des étudiants assignés",
      description:
        "Les assiduités avec des étudiants assignés ne peuvent pas être supprimées",
    },
  },
  courseTextbooks: {
    title: "Cahier de texte",
    courseTextbook: "Cahier de texte",
    create: "Créer une cahier de texte",
    columns: {
      courseCode: "Code",
      courseName: "Cours",
      userName: "Professeur(e)",
      contentDate: "Date",
      levelName: "Niveaux",
    },
    notifications: {
      createSuccess: "Cahier de texte créé avec succès",
      createError:
        "Une erreur s'est produite pendant la création du cahier de texte",
      createFailure: "Échec de la création de le cahier de texte",
      updateSuccess: "Cahier de texte modifié avec succès",
      updateError:
        "Une erreur s'est produite pendant la modification de le cahier de texte",
      updateFailure: "Échec de la modification du cahier de texte",
      deleteSuccess: "Cahier de texte supprimée avec succès",
      deleteError:
        "Une erreur s'est produite pendant la suppression du cahier de texte",
      deleteFailure: "Échec de la suppression du cahier de texte",
    },
    deleteModal: {
      title: "Êtes-vous sûr de vouloir supprimer le cahier de texte ?",
      description: "Le cahier de texte sera supprimée",
    },
  },
  courseContents: {
    textEditor: {
      placeholder: "Rédiger le contenu du cours...",
    },
    form: {
      course: "Cours",
      level: "Niveau scolaire",
      contentDate: "Date",
      content: "Contenu de cours",
    },
    validations: {
      courseValidation: "Le cours est obligatoire",
      contentDateValidation: "La date est obligatoire",
      contentFormatValidation: "Format de contenu invalide",
      contentValidation: "Le contenu de cours est obligatoire",
    },
  },
  courseHomeworks: {
    textEditor: {
      placeholder: "Rédiger le devoir...",
    },
    form: {
      addHomework: "Ajouter un devoir",
      homework: "Devoir",
      homeworkDueDate: "Date d'échéance",
      description: "description",
    },
    validations: {
      homeworkDateValidation: "La date est obligatoire",
      descriptionFormatValidation: "Format de la description invalide",
      descriptionValidation: "La description du devoir est obligatoire",
    },
  },
  studentProfile: {
    studentInfo: "Informations sur l'étudiant(e)",
    columns: {
      courseName: "Cours",
      courseCode: "Code du cours",
      code: "Code",
      grade: "Moyenne",
      levelName: "Niveau",
      scholarPeriodName: "Trimestre",
      scholarYearName: "Année",
    },
    expanded: {
      description: "Activité",
      activities: "Activités",
      gradeCoefficientName: "Type",
      grade: "Note",
      activityDate: "Date",
      userName: "Professeur(e)",
      userNameShort: "Prof",
    },
    changePassword: {
      title: "Modifier le mot de passe",
      nonUserError: "L'utilisateur n'a pas été trouvé",
    },
  },
  studentAttendances: {
    title: "Page d'assiduité",
    tabs: {
      orderedByDay: "Trié par jour",
      orderedByCourse: "Trié par cours",
    },
    columnsByCourse: {
      courseCode: "Code",
      courseName: "Cours",
      attendanceScore: "Absence",
    },
    columnsByCourseExtended: {
      attendanceDate: "Date",
      attendancePeriod: "Période",
      userName: "Professeur(e)",
      attendanceValue: "Assiduité",
    },
    columnsByDay: {
      courseCode: "Code",
      courseName: "Cours",
      attendanceDate: "Date",
      attendancePeriod: "Période",
      userName: "Professeur(e)",
      attendanceValue: "Assiduité",
    },
  },
  reports: {
    pageTitle: "Rapports",
    ifleStudentsNotes: {
      title: "Notes des étudiants IFLE",
      titlePage: "Notes des étudiants IFLE de",
      secretariatName: "Marta Oliver",
      data: {
        studentName: "Nom de l'étudiant(e)",
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
        exportPDF: "Transcript FR PDF",
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
        exportPDF: "Transcript EN PDF",
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
    ifleInscriptionAttestation: {
      secretariatName: "Marta Oliver",
      dpfFrench: {
        exportPDF: "Inscription FR PDF",
        titleInstitute: "Institut de francais langue etrangere",
        nomCampus: "Campus Adventiste du Saleve",
        address1: "33, Chemin du Pérouzet",
        address2: "74160 Collonges-Sous-Saleve, France",
        titleReport: "Inscription Officiel",
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
        },
      },
      dpfEnglish: {
        exportPDF: "Inscription EN PDF",
        titleInstitute: "Institut de francais langue etrangere",
        nomCampus: "Campus Adventiste du Saleve",
        address1: "33, Chemin du Pérouzet",
        address2: "74160 Collonges-Sous-Saleve, France",
        titleReport: "Official inscription",
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
          issuedTo: "Attestation issued to :",
          credits: "Credits :",
        },
        columns: {
          scholarYear: "Year/Quart.",
          courseCode: "Course N°",
          coursName: "Title",
          creditAmount: "Credit Hours",
        },
      },
    },
  },
};
