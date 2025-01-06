"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type createUserParamsType = {
  UserName: string;
  Password: string;
  RoleId: number;
};

const createUserCommand = async (params: createUserParamsType) => {
  return await prisma.users.create({
    data: {
      UserName: params.UserName,
      Password: params.Password,
      RoleId: params.RoleId,
    },
  });
};

export default createUserCommand;
