"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CreateRoleParams = {
  Name: string;
  IsEnabled: boolean;
};

const createRoleCommand = async (params: CreateRoleParams) => {
  const command = await prisma.roles.create({
    data: {
      Name: params.Name,
      IsEnabled: params.IsEnabled,
    },
  });

  return command;
};

export default createRoleCommand;
