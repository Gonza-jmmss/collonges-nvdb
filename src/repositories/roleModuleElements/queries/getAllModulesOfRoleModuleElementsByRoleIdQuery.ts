"use server";

import { PrismaClient } from "@prisma/client";
import { RoleModuleElementViewModel } from "../roleModuleElementsViewModel";

const prisma = new PrismaClient();

type getAllModulesOfRoleModuleElementsByRoleIdQueryParams = {
  RoleId: number;
};

const getAllModulesOfRoleModuleElementsByRoleIdQuery = async (
  params: getAllModulesOfRoleModuleElementsByRoleIdQueryParams,
) => {
  const query = await prisma.roleModuleElements.findMany({
    where: {
      RoleId: params.RoleId,
      ModuleId: { not: null },
    },
  });

  const res = query.map((roleModuleElement: RoleModuleElementViewModel) => ({
    RoleModuleElementId: roleModuleElement.RoleModuleElementId,
    ModuleId: roleModuleElement.ModuleId,
    RoleId: roleModuleElement.RoleId,
  }));
  return res;
};

export default getAllModulesOfRoleModuleElementsByRoleIdQuery;
