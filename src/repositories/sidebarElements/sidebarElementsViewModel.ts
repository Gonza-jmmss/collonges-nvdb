export type SidebarElementsViewModel = {
  SidebarElementId: number;
  Name: string;
  Path: string;
  Icon: string;
  Description: string;
  ModuleId: number | undefined;
  ModuleName: string | undefined;
  Location: number | null;
};

export type SidebarElementViewModel = {
  SidebarElementId: number;
  Name: string;
  Path: string;
  Icon: string;
  Description: string;
  ModuleId: number | null;
  Location: number | null;
  CreatedAt?: Date;
};

export type SidebarElementsMapViewModel = {
  SidebarElementId: number;
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
