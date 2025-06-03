"use server";

import { PrismaClient } from "@prisma/client";
import { RoleModuleElementSchema } from "@/zodSchemas/roleModuleElementSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type CreateRoleModuleElementParams = z.infer<typeof RoleModuleElementSchema>;

const createRoleModuleElementCommand = async (
  params: CreateRoleModuleElementParams,
) => {
  let roleModuleElementsToCreate: {
    RoleId: number;
    ModuleElementId: number | null;
    ModuleId: number | null;
    IsShortcut: boolean | null;
  }[] = [];

  if (params.Modules && params.Modules.length > 0) {
    params.Modules.forEach((element) => {
      roleModuleElementsToCreate.push({
        RoleId: params.RoleId,
        ModuleId: element.ModuleId,
        ModuleElementId: null,
        IsShortcut: null,
      });
    });
  }

  if (params.ModuleElements && params.ModuleElements.length > 0) {
    params.ModuleElements.forEach((element) => {
      roleModuleElementsToCreate.push({
        RoleId: params.RoleId,
        ModuleElementId: element.ModuleElementId,
        ModuleId: null,
        IsShortcut: element.IsShortcut,
      });
    });
  }

  const command = await prisma.roleModuleElements.createMany({
    data: roleModuleElementsToCreate,
  });

  return command;
};

export default createRoleModuleElementCommand;
