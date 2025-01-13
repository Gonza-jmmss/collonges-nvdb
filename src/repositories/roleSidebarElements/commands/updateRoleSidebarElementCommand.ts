"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type UpdateRoleSidebarElementParams = {
  RoleSidebarElementId: number;
  SidebarElementId: number | null;
  ModuleId: number | null;
  RoleId: number;
};

const updateRoleSidebarElementCommand = async (
  params: UpdateRoleSidebarElementParams,
) => {
  return await prisma.roleSidebarElements.update({
    where: {
      RoleSidebarElementId: params.RoleSidebarElementId,
    },
    data: {
      SidebarElementId: params.SidebarElementId,
      ModuleId: params.ModuleId,
      RoleId: params.RoleId,
    },
  });
};

export default updateRoleSidebarElementCommand;
