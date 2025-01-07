"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type updateUserParamsType = {
  UserId: number;
  UserName: string;
  RoleId: number;
};

const updateUserCommand = async (params: updateUserParamsType) => {
  return await prisma.users.update({
    where: {
      UserId: params.UserId,
    },
    data: {
      UserName: params.UserName,
      RoleId: params.RoleId,
    },
  });
};

export default updateUserCommand;
