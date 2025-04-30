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
  IsEnabled: boolean;
  YearPeriodId: number;
  YearPeriodName: string;
};

export type StudentsMap = {
  StudentId: number;
  PersonId: number;
  StudentTypeId: number;
  IsACA: boolean;
  DepartmentId: number | null;
  CollegeId: number | null;
  RegimeId: number | null;
  AccommodationId: number | null;
  IsEnabled: boolean;
  YearPeriodId: number;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  Persons?: {
    PersonId: number;
    AlternativeName: string | null;
    DBaseCode: string | null;
  } | null;
  StudentTypes?: {
    StudentTypeId: number;
    Name: string | null;
  } | null;
  YearPeriods: {
    YearPeriodId: number;
    Name: string;
  };
};
// export type StudentsByYearPeriodIdMap = {
//   StudentId: number;
//   PersonId: number;
//   StudentTypeId: number;
//   IsACA: boolean;
//   DepartmentId: number | null;
//   CollegeId: number | null;
//   RegimeId: number | null;
//   AccommodationId: number | null;
//   IsEnabled: boolean;
//   YearPeriodId: number;
//   UpdatedAt: Date | null;
//   CreatedAt: Date;
//   Persons?: {
//     PersonId: number;
//     AlternativeName: string | null;
//     DBaseCode: string | null;
//   } | null;
//   StudentTypes?: {
//     StudentTypeId: number;
//     Name: string | null;
//   } | null;
//   YearPeriods: {
//     YearPeriodId: number;
//     Name: string;
//   };
// };
