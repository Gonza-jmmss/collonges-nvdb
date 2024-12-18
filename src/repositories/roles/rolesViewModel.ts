export type RoleViewModel = {
  RoleId: number;
  Name: string;
  UpdatedAt?: Date | null;
  CreatedAt?: Date;
};

export type RolesViewModel = {
  RoleId: number;
  Name: string;
};

export interface RolesCreateViewModel {
  Name: string;
}

export interface RolesUpdateViewModel {
  RoleId: number;
  Name: string;
}

export interface RolesDeleteViewModel {
  RoleId: number;
}
