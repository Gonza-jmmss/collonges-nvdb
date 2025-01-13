"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CreateModuleElementParams = {
  Name: string;
  Path: string;
  Icon: string;
  Description: string;
  ModuleId: number | null;
  Location: number | null;
};

const createModuleElementCommand = async (
  params: CreateModuleElementParams,
) => {
  const command = await prisma.moduleElements.create({
    data: {
      Name: params.Name,
      Path: params.Path,
      Icon: params.Icon,
      Description: params.Description,
      ModuleId: params.ModuleId,
      Location: params.Location,
    },
  });

  return command;
};

export default createModuleElementCommand;
