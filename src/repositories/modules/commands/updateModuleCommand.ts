"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type UpdateModuleParams = {
  ModuleId: number;
  Name: string;
  Path: string;
  Icon: string;
  Location: number | null;
};

const updateModuleCommand = async (params: UpdateModuleParams) => {
  return await prisma.modules.update({
    where: {
      ModuleId: params.ModuleId,
    },
    data: {
      Name: params.Name,
      Path: params.Path,
      Icon: params.Icon,
      Location: params.Location,
    },
  });
};

export default updateModuleCommand;
