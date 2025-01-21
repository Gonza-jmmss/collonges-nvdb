"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DeleteRoleParams = {
  RoleId: number;
};

const deleteRoleCommand = async (params: DeleteRoleParams) => {
  return await prisma.roles.update({
    where: {
      RoleId: params.RoleId,
    },
    data: {
      IsEnabled: false,
    },
  });
};

export default deleteRoleCommand;
