"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CreateRoleModuleElementParams = {
  ModuleElementId: number | null;
  ModuleId: number | null;
  RoleId: number;
};

const createRoleModuleElementCommand = async (
  params: CreateRoleModuleElementParams,
) => {
  const command = await prisma.roleModuleElements.create({
    data: {
      ModuleElementId: params.ModuleElementId,
      ModuleId: params.ModuleId,
      RoleId: params.RoleId,
    },
  });

  return command;
};

export default createRoleModuleElementCommand;
