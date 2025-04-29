export type yearPeriodsViewModel = {
  YearPeriodId: number;
  Name: string;
  PeriodType: number;
  ScholarYearId: number;
  IsEnabled: boolean;
  IsDeletable?: boolean;
};

export type yearPeriodsMap = {
  YearPeriodId: number;
  Name: string;
  PeriodType: number;
  ScholarYearId: number;
  IsEnabled: boolean;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  ScholarYears: {
    ScholarYearId: number;
    Name: string;
    FromDate: Date | null;
    ToDate: Date | null;
    UpdatedAt: Date | null;
    CreatedAt: Date;
    IsActive: boolean;
  };
  Students: {
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
  }[];
};
