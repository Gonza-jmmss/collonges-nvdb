"use server";

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

type updateUserPasswordParamsType = {
  UserId: number;
  Password: string;
};

const updateUserPasswordCommand = async (
  params: updateUserPasswordParamsType,
) => {
  const hashedPassword = (await bcrypt.hash(params.Password, 10)).toString();

  return await prisma.users.update({
    where: {
      UserId: params.UserId,
    },
    data: {
      Password: hashedPassword,
    },
  });
};

export default updateUserPasswordCommand;
