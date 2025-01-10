"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DeleteSidebarElementParams = {
  SidebarElementId: number;
};

const deleteSidebarElementCommand = async (
  params: DeleteSidebarElementParams,
) => {
  return await prisma.sidebarElements.delete({
    where: {
      SidebarElementId: params.SidebarElementId,
    },
  });
};

export default deleteSidebarElementCommand;
