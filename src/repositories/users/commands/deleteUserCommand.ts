"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type deleteUserParamsType = {
  UserId: number;
};

const deleteUserCommand = async (params: deleteUserParamsType) => {
  return await prisma.users.update({
    where: {
      UserId: params.UserId,
    },
    data: {
      IsEnabled: false,
    },
  });
};

export default deleteUserCommand;
