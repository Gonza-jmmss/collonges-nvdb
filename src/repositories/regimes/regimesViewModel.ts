export type RegimeViewModel = {
  RegimeId: number;
  Name: string | null;
  Abbreviation: string | null;
};

export type RegimesViewModel = {
  RegimeId: number;
  Name: string | null;
  Abbreviation: string | null;
  UpdatedAt: Date | null;
  CreatedAt: Date;
};
