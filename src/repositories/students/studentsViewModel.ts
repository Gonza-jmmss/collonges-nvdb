export type StudentsViewModel = {
  StudentId: number;
  PersonId: number;
  StudentTypeId: number;
  IsACA: boolean;
  DepartmentId?: number | null;
  CollegeId?: number | null;
  RegimeId?: number | null;
  AccommodationId?: number | null;
  UpdatedAt?: Date | null;
  CreatedAt: Date;
  StudentName?: string | null;
  StudentType?: string | null;
  DBaseCode?: string | null;
};

export type StudentsMapViewModel = {
  StudentId: number;
  PersonId: number;
  StudentTypeId: number;
  IsACA: boolean;
  DepartmentId: number | null;
  CollegeId: number | null;
  RegimeId: number | null;
  AccommodationId: number | null;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  Persons?: {
    AlternativeName: string | null;
    DBaseCode: string | null;
  } | null;
  StudentTypes?: {
    Name: string | null;
  } | null;
};

// export type StudentCourseViewModel = {
//   Courses: {
//     Name: string;
//     EnglishName: string;
//     CourseCode: string | null;
//     CreditAmount: number;
//     PeriodNumber: number | null;
//   };
//   ScholarYears: {
//     Name: string;
//   };
//   StudentId: number;
//   UpdatedAt: Date | null;
//   Note: string;
// };
