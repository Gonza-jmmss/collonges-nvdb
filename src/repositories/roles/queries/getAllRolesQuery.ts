import { PrismaClient } from "@prisma/client";
import { RolesMap } from "../rolesViewModel";

const prisma = new PrismaClient();

type getAllRolesQueryParams = {
  IsEnabled: boolean;
};

const getAllRolesQuery = async (params: getAllRolesQueryParams) => {
  const query = await prisma.roles.findMany({
    where: { IsEnabled: params.IsEnabled },
    include: {
      Users: true,
    },
  });

  const res = query.map((roles: RolesMap) => ({
    RoleId: roles.RoleId,
    Name: roles.Name,
    IsEnabled: roles.IsEnabled,
    isDeletable: roles.Users.length === 0,
  }));

  return res;
};

export default getAllRolesQuery;
