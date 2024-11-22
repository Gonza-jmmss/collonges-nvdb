export type StudentNotesViewModel = {
  CourseCode: string | null;
  Quarter: number | null;
  CourseName: string | null;
  CoursEnglishName: string | null;
  ScholarYear: string | null;
  CreditAmount: number | null;
  Note: string | null;
};

export type QuarterNotesResultViewModel = {
  StudentName: string | null;
  DBaseCode: string | null;
  BirthDate: Date | null;
  BirthCountry: string | null | undefined;
  BirthCity: string | null;
  CourseNotes: {
    CourseCode: string | null;
    Quarter: number | null;
    CourseName: string | null;
    CoursEnglishName: string | null;
    ScholarYear: string | null;
    CreditAmount: number | null;
    Note: string | null;
  }[];
};
