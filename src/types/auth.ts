export interface Role {
  RoleId: number;
  Name: string;
  UpdatedAt: Date | null;
  CreatedAt: Date;
}

export interface UserData {
  UserId: number;
  UserName: string;
  Password: string;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  RoleId: number;
  Roles: Role;
}

export interface RoleModule {
  RoleModuleElementId: number;
  ModuleElementName?: string;
  ModuleElementId?: number;
  ModuleName?: string;
  ModuleId?: number;
  Path: string;
  RoleName: string;
  RoleId: number;
}

export interface CustomUser {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  userData: UserData;
  roleModules: RoleModule[];
}
