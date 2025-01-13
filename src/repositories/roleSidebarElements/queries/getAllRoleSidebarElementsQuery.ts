"use server";

import { cache } from "react";
import { PrismaClient } from "@prisma/client";
import { RoleSidebarElementsMapViewModel } from "../roleSidebarElementsViewModel";

const prisma = new PrismaClient();

const getAllRoleSidebarElementsQuery = cache(async () => {
  const query = await prisma.roleSidebarElements.findMany({
    include: {
      SidebarElements: true,
      Modules: true,
      Roles: true,
    },
  });

  const res = query.map(
    (roleSidebarElement: RoleSidebarElementsMapViewModel) => ({
      RoleSidebarElementId: roleSidebarElement.RoleSidebarElementId,
      SidebarElementName: roleSidebarElement.SidebarElements?.Name,
      ModuleName: roleSidebarElement.Modules?.Name,
      Path:
        roleSidebarElement.SidebarElements?.Path ||
        roleSidebarElement.Modules?.Path ||
        "",
      RoleName: roleSidebarElement.Roles.Name,
    }),
  );

  return res;
});

export default getAllRoleSidebarElementsQuery;
