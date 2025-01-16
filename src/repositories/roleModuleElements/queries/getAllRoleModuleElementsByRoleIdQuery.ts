"use server";

import { PrismaClient } from "@prisma/client";
import { RoleModuleElementsMapViewModel } from "../roleModuleElementsViewModel";

const prisma = new PrismaClient();

const getAllRoleModuleElementsByRoleIdQuery = async (RoleId: number) => {
  const query = await prisma.roleModuleElements.findMany({
    where: { RoleId: RoleId },
    include: {
      ModuleElements: true,
      Modules: true,
      Roles: true,
    },
  });

  const res = query.map(
    (roleModuleElement: RoleModuleElementsMapViewModel) => ({
      RoleModuleElementId: roleModuleElement.RoleModuleElementId,
      ModuleElementName: roleModuleElement.ModuleElements?.Name,
      ModuleElementId: roleModuleElement.ModuleElements?.ModuleElementId,
      ModuleName: roleModuleElement.Modules?.Name,
      ModuleId: roleModuleElement.Modules?.ModuleId,
      Path:
        roleModuleElement.ModuleElements?.Path ||
        roleModuleElement.Modules?.Path ||
        "",
      RoleName: roleModuleElement.Roles.Name,
      RoleId: roleModuleElement.Roles.RoleId,
    }),
  );

  return res;
};

export default getAllRoleModuleElementsByRoleIdQuery;
