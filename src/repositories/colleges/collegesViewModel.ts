export type CollegeViewModel = {
  CollegeId: number;
  Name: string | null;
  Abbreviation: string | null;
};

export type CollegesViewModel = {
  CollegeId: number;
  Name: string | null;
  Abbreviation: string | null;
  UpdatedAt: Date | null;
  CreatedAt: Date;
};
