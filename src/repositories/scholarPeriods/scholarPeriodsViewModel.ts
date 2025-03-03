export type ScholarPeriodsViewModel = {
  ScholarPeriodId: number;
  Name: string;
  Number: number | null;
  FromDate: Date | null;
  ToDate: Date | null;
  IsActive: boolean;
  ScholarYearId: number;
};

export type ScholarPeriodMap = {
  ScholarPeriodId: number;
  Name: string;
  Number: number | null;
  FromDate: Date | null;
  ToDate: Date | null;
  IsActive: boolean;
  ScholarYearId: number;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  ScholarYears: {
    ScholarYearId: number;
    Name: string;
    FromDate: Date | null;
    ToDate: Date | null;
    UpdatedAt: Date | null;
    CreatedAt: Date;
    IsActive: Boolean;
  };
};
