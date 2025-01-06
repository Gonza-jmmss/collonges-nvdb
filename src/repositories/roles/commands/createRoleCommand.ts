"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CreateRoleParams = {
  Name: string;
};

const createRoleCommand = async (params: CreateRoleParams) => {
  console.log("createRoleCommand");
  const command = await prisma.roles.create({
    data: {
      Name: params.Name,
    },
  });
  console.log("command", command);
  return command;
};

export default createRoleCommand;
