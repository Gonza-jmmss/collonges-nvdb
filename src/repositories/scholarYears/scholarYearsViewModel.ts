export type ScholarYearsViewModel = {
  ScholarYearId: number;
  Name: string;
  FromDate: Date | null;
  ToDate: Date | null;
  IsActive: Boolean;
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
