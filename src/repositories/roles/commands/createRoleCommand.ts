"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CreateRoleParams = {
  Name: string;
};

const createRoleCommand = async (params: CreateRoleParams) => {
  const command = await prisma.roles.create({
    data: {
      Name: params.Name,
    },
  });

  return command;
};

export default createRoleCommand;
