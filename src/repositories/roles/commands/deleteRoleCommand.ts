"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DeleteRoleParams = {
  RoleId: number;
};

const deleteRoleCommand = async (params: DeleteRoleParams) => {
  return await prisma.roles.delete({
    where: { RoleId: params.RoleId },
  });
};

export default deleteRoleCommand;
