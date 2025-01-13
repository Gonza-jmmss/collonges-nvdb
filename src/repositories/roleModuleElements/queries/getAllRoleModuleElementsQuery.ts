"use server";

import { cache } from "react";
import { PrismaClient } from "@prisma/client";
import { RoleModuleElementsMapViewModel } from "../roleModuleElementsViewModel";

const prisma = new PrismaClient();

const getAllRoleModuleElementsQuery = cache(async () => {
  const query = await prisma.roleModuleElements.findMany({
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
      ModuleName: roleModuleElement.Modules?.Name,
      Path:
        roleModuleElement.ModuleElements?.Path ||
        roleModuleElement.Modules?.Path ||
        "",
      RoleName: roleModuleElement.Roles.Name,
    }),
  );

  return res;
});

export default getAllRoleModuleElementsQuery;
