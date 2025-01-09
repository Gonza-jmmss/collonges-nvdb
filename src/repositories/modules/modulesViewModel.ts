export type ModulesViewModel = {
  ModuleId: number;
  Name: string;
  Path: string;
  Icon: string;
  Location: number | null;
};

export type ModuleViewModel = {
  ModuleId: number;
  Name: string;
  Path: string;
  Icon: string;
  Location: number | null;
  UpdatedAt?: Date | null;
  CreatedAt?: Date;
};
