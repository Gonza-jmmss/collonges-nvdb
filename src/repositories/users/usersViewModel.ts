export type UserViewModel = {
  UserId: number;
  UserName: string;
  Password: string;
  RoleId: number;
  RoleName: string;
  UpdatedAt?: Date | null;
  CreatedAt?: Date | null;
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

export type UserCreateViewModel = {
  UserId: number;
  UserName: string;
  Password: string;
  RoleId: number;
  UpdatedAt?: Date | null;
  CreatedAt?: Date | null;
};

export interface UserCreateInterface {
  UserName: string;
  Password: string;
  RoleId: number;
}

export interface UserUpdateViewModel {
  UserId: number;
  UserName: string;
}

export interface UserDeleteViewModel {
  UserId: number;
}
