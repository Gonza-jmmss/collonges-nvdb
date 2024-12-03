export type StudentNotesViewModel = {
  CourseCode: string | null;
  Quarter: number | null;
  CourseName: string | null;
  CoursEnglishName: string | null;
  ScholarYear: string | null;
  CreditAmount: number | null;
  Note: string | null;
  AmericanNote: string | null;
};

export type QuarterNotesResultViewModel = {
  StudentName: string | null;
  StudentFirstName: string | null;
  StudentLastName: string | null;
  DBaseCode: string | null;
  Birthdate: Date | null;
  BirthCountryFr: string | null | undefined;
  BirthCountryEn: string | null | undefined;
  CollegeAbbreviation: string | null | undefined;
  BirthCity: string | null;
  CourseNotes: {
    CourseCode: string | null;
    Quarter: number | null;
    CourseName: string | null;
    CoursEnglishName: string | null;
    ScholarYear: string | null;
    CreditAmount: number | null;
    Note: string | null;
    AmericanNote: string | null;
  }[];
};
