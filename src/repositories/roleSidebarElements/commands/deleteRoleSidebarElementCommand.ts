"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DeleteRoleSidebarElementParams = {
  RoleSidebarElementId: number;
};

const deleteRoleSidebarElementCommand = async (
  params: DeleteRoleSidebarElementParams,
) => {
  return await prisma.roleSidebarElements.delete({
    where: {
      RoleSidebarElementId: params.RoleSidebarElementId,
    },
  });
};

export default deleteRoleSidebarElementCommand;
