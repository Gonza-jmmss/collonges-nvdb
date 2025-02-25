export type ScholarPeriodsViewModel = {
  ScholarPeriodId: number;
  Name: string;
  Number: number | null;
  FromDate: Date | null;
  ToDate: Date | null;
  IsActive: Boolean;
  ScholarYearId: number;
};

export type ScholarPeriodMap = {
  ScholarPeriodId: number;
  Name: string;
  Number: number | null;
  FromDate: Date | null;
  ToDate: Date | null;
  IsActive: Boolean;
  ScholarYearId: number;
  UpdatedAt: Date | null;
  CreatedAt: Date;
};
