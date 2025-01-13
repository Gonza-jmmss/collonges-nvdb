"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DeleteRoleModuleElementParams = {
  RoleModuleElementId: number;
};

const deleteRoleModuleElementCommand = async (
  params: DeleteRoleModuleElementParams,
) => {
  return await prisma.roleModuleElements.delete({
    where: {
      RoleModuleElementId: params.RoleModuleElementId,
    },
  });
};

export default deleteRoleModuleElementCommand;
