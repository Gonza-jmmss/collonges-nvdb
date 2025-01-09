"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CreateModuleParams = {
  Name: string;
  Path: string;
  Icon: string;
  Location: number | null;
};

const createModuleCommand = async (params: CreateModuleParams) => {
  const command = await prisma.modules.create({
    data: {
      Name: params.Name,
      Path: params.Path,
      Icon: params.Icon,
      Location: params.Location,
    },
  });

  return command;
};

export default createModuleCommand;
