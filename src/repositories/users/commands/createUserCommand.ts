"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type createUserParamsType = {
  UserName: string;
  Password: string;
  RoleId: number;
  IsEnabled: boolean;
  StudentId?: number | null;
  transactionClient?: any;
};

const createUserCommand = async (params: createUserParamsType) => {
  const client = params.transactionClient || prisma;

  const hashedPassword = (await bcrypt.hash(params.Password, 10)).toString();

  return await client.users.create({
    data: {
      UserName: params.UserName,
      Password: hashedPassword,
      RoleId: params.RoleId,
      IsEnabled: params.IsEnabled,
      StudentId: params.StudentId ? params.StudentId : null,
    },
  });
};

export default createUserCommand;
