"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type UpdateRoleParams = {
  RoleId: number;
  Name: string;
};

const updateRoleCommand = async (params: UpdateRoleParams) => {
  return await prisma.roles.update({
    where: {
      RoleId: params.RoleId,
    },
    data: {
      Name: params.Name,
    },
  });
};

export default updateRoleCommand;
