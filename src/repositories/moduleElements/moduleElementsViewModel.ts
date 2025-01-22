export type ModuleElementsViewModel = {
  ModuleElementId: number;
  Name: string;
  Path: string;
  Icon: string;
  Description: string;
  ModuleId: number | undefined;
  ModuleName: string | undefined;
  Location: number | null;
};

export type ModuleElementViewModel = {
  ModuleElementId: number;
  Name: string;
  Path: string;
  Icon: string;
  Description: string;
  ModuleId: number | null;
  Location: number | null;
  CreatedAt?: Date;
};

export type ModuleElementsMapViewModel = {
  ModuleElementId: number;
  Name: string;
  Path: string;
  Icon: string;
  Description: string;
  Location: number | null;
  Modules: {
    ModuleId: number;
    Name: string;
    Path: string;
    Icon: string;
    Location: number | null;
    UpdatedAt?: Date | null;
    CreatedAt?: Date;
  } | null;
};
