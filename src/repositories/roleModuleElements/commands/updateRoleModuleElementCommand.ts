"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type UpdateRoleModuleElementParams = {
  RoleModuleElementId: number;
  ModuleElementId: number | null;
  ModuleId: number | null;
  RoleId: number;
};

const updateRoleModuleElementCommand = async (
  params: UpdateRoleModuleElementParams,
) => {
  return await prisma.roleModuleElements.update({
    where: {
      RoleModuleElementId: params.RoleModuleElementId,
    },
    data: {
      ModuleElementId: params.ModuleElementId,
      ModuleId: params.ModuleId,
      RoleId: params.RoleId,
    },
  });
};

export default updateRoleModuleElementCommand;
