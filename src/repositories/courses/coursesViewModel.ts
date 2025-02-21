export type CoursesViewModel = {
  CourseId: number;
  Name: string;
  EnglishName: string;
  CourseCode: string | null;
  CreditAmount: number;
  CoursePeriodId: number;
  CoursePeriodName: string | undefined;
  PeriodNumber: number | null;
  CourseTypeId: number;
  IsEnabled: boolean | null;
};

export type CourseViewModel = {
  CourseId: number;
  Name: string;
  EnglishName: string;
  CourseCode: string | null;
  CreditAmount: number;
  CoursePeriodId: number;
  PeriodNumber: number | null;
  CourseTypeId: number;
  IsEnabled: boolean | null;
  UpdatedAt?: Date | null;
  CreatedAt?: Date;
};

export type CourseElementsMapViewModel = {
  CourseId: number;
  Name: string;
  EnglishName: string;
  CourseCode: string | null;
  CreditAmount: number;
  CoursePeriodId: number;
  PeriodNumber: number | null;
  CourseTypeId: number;
  IsEnabled: boolean | null;
  CoursePeriods: {
    CoursePeriodId: number;
    Name: string;
    MonthAmount: number;
    UpdatedAt?: Date | null;
    CreatedAt?: Date;
  } | null;
};
