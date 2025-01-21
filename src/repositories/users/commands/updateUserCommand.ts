"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type updateUserParamsType = {
  UserId: number;
  UserName: string;
  RoleId: number;
  IsEnabled: boolean;
};

const updateUserCommand = async (params: updateUserParamsType) => {
  return await prisma.users.update({
    where: {
      UserId: params.UserId,
    },
    data: {
      UserName: params.UserName,
      RoleId: params.RoleId,
      IsEnabled: params.IsEnabled,
    },
  });
};

export default updateUserCommand;
