export type RoleSidebarElementsViewModel = {
  RoleSidebarElementId: number;
  SidebarElementName: string | undefined;
  ModuleName: string | undefined;
  Path: string;
  RoleName: string;
};

export type RoleSidebarElementViewModel = {
  RoleSidebarElementId: number;
  SidebarElementId: number | null;
  ModuleId: number | null;
  RoleId: number;
  UpdatedAt?: Date | null;
  CreatedAt?: Date;
};

export type RoleSidebarElementsMapViewModel = {
  RoleSidebarElementId: number;
  SidebarElements: {
    SidebarElementId: number;
    Name: string;
    Path: string;
    Icon: string;
    Description: string;
    ModuleId: number | null;
    Location: number | null;
    UpdatedAt?: Date | null;
    CreatedAt?: Date;
  } | null;
  Modules: {
    ModuleId: number;
    Name: string;
    Path: string;
    Icon: string;
    Location: number | null;
    UpdatedAt?: Date | null;
    CreatedAt?: Date;
  } | null;
  Roles: {
    RoleId: number;
    Name: string;
    UpdatedAt?: Date | null;
    CreatedAt?: Date;
  };
};
