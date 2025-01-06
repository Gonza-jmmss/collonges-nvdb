export type getAllUsersQueryViewModel = {
  UserId: number;
  UserName: string;
  RoleId: number;
  RoleName: string;
};

export type UsersViewModel = {
  UserId: number;
  UserName: string;
  Roles: {
    RoleId: number;
    Name: string;
    UpdatedAt: Date | null;
    CreatedAt: Date;
  };
};

export type UserViewModel = {
  UserId: number;
  UserName: string;
  RoleId: number;
  RoleName: string;
} | null;
