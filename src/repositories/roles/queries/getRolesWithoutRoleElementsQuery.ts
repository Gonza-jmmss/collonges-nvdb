import { PrismaClient } from "@prisma/client";
import { RolesWithoutRoleElementsMap } from "../rolesViewModel";

const prisma = new PrismaClient();

const getRolesWithoutRoleElementsQuery = async () => {
  const query = await prisma.roles.findMany({
    where: { RoleModuleElements: { none: {} }, IsEnabled: true },
  });

  const res = query.map((roles: RolesWithoutRoleElementsMap) => ({
    RoleId: roles.RoleId,
    Name: roles.Name,
    IsEnabled: roles.IsEnabled,
  }));

  return res;
};

export default getRolesWithoutRoleElementsQuery;
