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
  IsEnabled: boolean;
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
