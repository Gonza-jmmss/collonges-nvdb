export type RoleModuleElementsViewModel = {
  RoleModuleElementId: number;
  ModuleElementName: string | undefined;
  ModuleElementId: number | undefined;
  ModuleName: string | undefined;
  ModuleId: number | undefined;
  Path: string;
  RoleName: string;
  RoleId: string;
};

export type RoleModuleElementViewModel = {
  RoleModuleElementId: number;
  ModuleElementId: number | null;
  ModuleId: number | null;
  RoleId: number;
  UpdatedAt?: Date | null;
  CreatedAt?: Date;
};

export type RoleModuleElementsMapViewModel = {
  RoleModuleElementId: number;
  ModuleElements: {
    ModuleElementId: number;
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

export type ModuleElementsMapViewModel = {
  RoleModuleElementId: number;
  ModuleElements: {
    ModuleElementId: number;
    Name: string;
    Path: string;
    Icon: string;
    Description: string;
    ModuleId: number | null;
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

export type ModulesMapViewModel = {
  RoleModuleElementId: number;
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
