export type ScholarYearsViewModel = {
  ScholarYearId: number;
  Name: string;
  FromDate: Date | null;
  ToDate: Date | null;
  IsActive: boolean;
  IsDeletable?: boolean;
};

export type ScholarYearMap = {
  ScholarYearId: number;
  Name: string;
  FromDate: Date | null;
  ToDate: Date | null;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  IsActive: boolean;
};

export type ScholarYearTableMap = {
  ScholarYearId: number;
  Name: string;
  FromDate: Date | null;
  ToDate: Date | null;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  IsActive: boolean;
  ScholarPeriods: {
    ScholarPeriodId: number;
    Name: string;
    Number: number | null;
    FromDate: Date | null;
    ToDate: Date | null;
    IsActive: boolean;
    ScholarYearId: number;
    UpdatedAt: Date | null;
    CreatedAt: Date;
  }[];
};
