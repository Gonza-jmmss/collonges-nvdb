"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DeleteRoleParams = {
  RoleId: number;
};

const disableRoleCommand = async (params: DeleteRoleParams) => {
  return await prisma.roles.update({
    where: {
      RoleId: params.RoleId,
    },
    data: {
      IsEnabled: false,
    },
  });
};

export default disableRoleCommand;
