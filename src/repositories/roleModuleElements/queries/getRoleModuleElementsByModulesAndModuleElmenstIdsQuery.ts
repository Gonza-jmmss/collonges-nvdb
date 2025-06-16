"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type getRoleModuleElementsByModulesAndModuleElmenstIdsQueryParams = {
  RoleId: number;
  ModuleIds: (number | null)[];
  ModuleElementIds: (number | null)[];
};

const getRoleModuleElementsByModulesAndModuleElmenstIdsQuery = async (
  params: getRoleModuleElementsByModulesAndModuleElmenstIdsQueryParams,
) => {
  const modulesQuery = await prisma.roleModuleElements.findMany({
    where: {
      RoleId: params.RoleId,
      ModuleId: { in: params.ModuleIds.filter((x) => x !== null) },
    },
    select: {
      RoleModuleElementId: true,
    },
  });

  const moduleElementsQuery = await prisma.roleModuleElements.findMany({
    where: {
      RoleId: params.RoleId,
      ModuleElementId: {
        in: params.ModuleElementIds.filter((x) => x !== null),
      },
    },
    select: {
      RoleModuleElementId: true,
    },
  });

  return modulesQuery.concat(moduleElementsQuery);
};

export default getRoleModuleElementsByModulesAndModuleElmenstIdsQuery;
