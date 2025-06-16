"use server";

import getAllRoleModuleElementsByRoleIdQuery from "../queries/getAllRoleModuleElementsByRoleIdQuery";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DeleteRoleModuleElementParams = {
  RoleId: number;
};

const deleteRoleModuleElementCommand = async (
  params: DeleteRoleModuleElementParams,
) => {
  const roleModuleElements = await getAllRoleModuleElementsByRoleIdQuery(
    params.RoleId,
  );

  return await prisma.roleModuleElements.deleteMany({
    where: {
      RoleModuleElementId: {
        in: roleModuleElements.map((x) => x.RoleModuleElementId),
      },
    },
  });
};

export default deleteRoleModuleElementCommand;
