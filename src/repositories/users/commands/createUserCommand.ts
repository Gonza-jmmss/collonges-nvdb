"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type createUserParamsType = {
  UserName: string;
  Password: string;
  RoleId: number;
  IsEnabled: boolean;
};

const createUserCommand = async (params: createUserParamsType) => {
  const hashedPassword = (await bcrypt.hash(params.Password, 10)).toString();

  return await prisma.users.create({
    data: {
      UserName: params.UserName,
      Password: hashedPassword,
      RoleId: params.RoleId,
      IsEnabled: params.IsEnabled,
    },
  });
};

export default createUserCommand;
