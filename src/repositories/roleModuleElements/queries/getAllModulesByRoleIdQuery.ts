"use server";

import { PrismaClient } from "@prisma/client";
import { ModulesMapViewModel } from "../roleModuleElementsViewModel";

const prisma = new PrismaClient();

const getAllModulesByRoleIdQuery = async (RoleId: number) => {
  const query = await prisma.roleModuleElements.findMany({
    where: { RoleId: RoleId, ModuleId: { not: 0 } },
    include: {
      Modules: true,
      Roles: true,
    },
  });

  const res = query.map((roleModuleElement: ModulesMapViewModel) => ({
    ModuleId: roleModuleElement.Modules?.ModuleId || 0,
    Name: roleModuleElement.Modules?.Name || "",
    Path: roleModuleElement.Modules?.Path || "",
    Icon: roleModuleElement.Modules?.Icon || "",
    Location: roleModuleElement.Modules?.Location || null,
  }));

  return res;
};

export default getAllModulesByRoleIdQuery;
