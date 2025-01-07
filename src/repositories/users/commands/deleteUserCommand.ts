"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type deleteUserParamsType = {
  UserId: number;
};

const deleteUserCommand = async (params: deleteUserParamsType) => {
  return await prisma.users.delete({
    where: {
      UserId: params.UserId,
    },
  });
};

export default deleteUserCommand;
