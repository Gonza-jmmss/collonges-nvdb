import { PrismaClient } from "@prisma/client";
import { RolesViewModel } from "../rolesViewModel";

const prisma = new PrismaClient();

const getRolesWithoutRoleElementsQuery = async () => {
  const query = await prisma.roles.findMany({
    where: { RoleModuleElements: { none: {} } },
  });

  const res = query.map((roles: RolesViewModel) => ({
    RoleId: roles.RoleId,
    Name: roles.Name,
    IsEnabled: roles.IsEnabled,
  }));

  return res;
};

export default getRolesWithoutRoleElementsQuery;
