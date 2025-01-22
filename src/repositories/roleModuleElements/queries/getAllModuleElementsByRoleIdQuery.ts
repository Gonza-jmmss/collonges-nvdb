"use server";

import { PrismaClient } from "@prisma/client";
import { ModuleElementsMapViewModel } from "../roleModuleElementsViewModel";

const prisma = new PrismaClient();

const getAllModuleElementsByRoleIdQuery = async (
  RoleId: number,
  moduleId: number,
) => {
  const query = await prisma.roleModuleElements.findMany({
    orderBy: {
      ModuleElements: {
        Location: "asc",
      },
    },
    where: {
      RoleId: { equals: RoleId },
      ModuleElements: { ModuleId: moduleId },
    },
    include: {
      ModuleElements: true,
      Roles: true,
    },
  });

  const res = query.map((roleModuleElement: ModuleElementsMapViewModel) => ({
    ModuleElementId: roleModuleElement.ModuleElements?.ModuleId || 0,
    Name: roleModuleElement.ModuleElements?.Name || "",
    Path: roleModuleElement.ModuleElements?.Path || "",
    Icon: roleModuleElement.ModuleElements?.Icon || "",
    Description: roleModuleElement.ModuleElements?.Description || "",
    ModuleId: roleModuleElement.ModuleElements?.ModuleId || 0,
    ModuleName: "",
    Location: roleModuleElement.ModuleElements?.Location || null,
  }));

  return res;
};

export default getAllModuleElementsByRoleIdQuery;
