export type RolesViewModel = {
  RoleId: number;
  Name: string;
  IsEnabled: boolean;
  isDeletable?: boolean;
};

export type RolesMap = {
  RoleId: number;
  Name: string;
  IsEnabled: boolean;
  UpdatedAt: Date | null;
  CreatedAt: Date;
  Users: {
    UserId: number;
    UserName: string;
    Password: string;
    RoleId: number;
    IsEnabled: boolean;
    UpdatedAt: Date | null;
    CreatedAt: Date;
  }[];
};

export type RolesWithoutRoleElementsMap = {
  RoleId: number;
  Name: string;
  IsEnabled: boolean;
  UpdatedAt: Date | null;
  CreatedAt: Date;
};
