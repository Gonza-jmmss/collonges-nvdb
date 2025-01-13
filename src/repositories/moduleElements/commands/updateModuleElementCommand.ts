"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type UpdateModuleElementParams = {
  ModuleElementId: number;
  Name: string;
  Path: string;
  Icon: string;
  Description: string;
  ModuleId: number | null;
  Location: number | null;
};

const updateModuleElementCommand = async (
  params: UpdateModuleElementParams,
) => {
  return await prisma.moduleElements.update({
    where: {
      ModuleElementId: params.ModuleElementId,
    },
    data: {
      Name: params.Name,
      Path: params.Path,
      Icon: params.Icon,
      Description: params.Description,
      ModuleId: params.ModuleId,
      Location: params.Location,
    },
  });
};

export default updateModuleElementCommand;
