"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type UpdateSidebarElementParams = {
  SidebarElementId: number;
  Name: string;
  Path: string;
  Icon: string;
  Description: string;
  ModuleId: number | null;
  Location: number | null;
};

const updateSidebarElementCommand = async (
  params: UpdateSidebarElementParams,
) => {
  return await prisma.sidebarElements.update({
    where: {
      SidebarElementId: params.SidebarElementId,
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

export default updateSidebarElementCommand;
