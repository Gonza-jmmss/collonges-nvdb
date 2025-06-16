export type CollegeViewModel = {
  CollegeId: number;
  Name: string | null;
  Abbreviation: string | null;
  IsDeletable?: boolean;
};

export type CollegesViewModel = {
  CollegeId: number;
  Name: string | null;
  Abbreviation: string | null;
  UpdatedAt: Date | null;
  CreatedAt: Date;
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
