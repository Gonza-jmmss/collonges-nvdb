"use server";

import { PrismaClient } from "@prisma/client";
import { RoleModuleElementViewModel } from "../roleModuleElementsViewModel";

const prisma = new PrismaClient();

type getAllModuleElementsOfRoleModuleElementsByRoleIdQueryParams = {
  RoleId: number;
};

const getAllModuleElementsOfRoleModuleElementsByRoleIdQuery = async (
  params: getAllModuleElementsOfRoleModuleElementsByRoleIdQueryParams,
) => {
  const query = await prisma.roleModuleElements.findMany({
    where: {
      RoleId: params.RoleId,
      ModuleElementId: { not: null },
    },
  });

  const res = query.map((roleModuleElement: RoleModuleElementViewModel) => ({
    RoleModuleElementId: roleModuleElement.RoleModuleElementId,
    ModuleElementId: roleModuleElement.ModuleElementId,
    RoleId: roleModuleElement.RoleId,
  }));
  return res;
};

export default getAllModuleElementsOfRoleModuleElementsByRoleIdQuery;
