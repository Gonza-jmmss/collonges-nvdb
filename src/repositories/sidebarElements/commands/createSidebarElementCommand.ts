"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CreateSidebarElementParams = {
  Name: string;
  Path: string;
  Icon: string;
  Description: string;
  ModuleId: number | null;
  Location: number | null;
};

const createSidebarElementCommand = async (
  params: CreateSidebarElementParams,
) => {
  const command = await prisma.sidebarElements.create({
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

export default createSidebarElementCommand;
