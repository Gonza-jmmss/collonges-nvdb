"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CreateRoleSidebarElementParams = {
  SidebarElementId: number | null;
  ModuleId: number | null;
  RoleId: number;
};

const createRoleSidebarElementCommand = async (
  params: CreateRoleSidebarElementParams,
) => {
  const command = await prisma.roleSidebarElements.create({
    data: {
      SidebarElementId: params.SidebarElementId,
      ModuleId: params.ModuleId,
      RoleId: params.RoleId,
    },
  });

  return command;
};

export default createRoleSidebarElementCommand;
