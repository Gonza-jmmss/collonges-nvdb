import { PrismaClient } from "@prisma/client";
import { RolesViewModel } from "../rolesViewModel";

const prisma = new PrismaClient();

const getAllRolesQuery = async () => {
  const query = await prisma.roles.findMany({});

  const res = query.map((roles: RolesViewModel) => ({
    RoleId: roles.RoleId,
    Name: roles.Name,
    IsEnabled: roles.IsEnabled,
  }));

  return res;
};

export default getAllRolesQuery;
