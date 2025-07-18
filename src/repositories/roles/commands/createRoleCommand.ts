"use server";

import { PrismaClient } from "@prisma/client";
import { RoleSchema } from "@/zodSchemas/roleSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type createRoleCommandParams = z.infer<typeof RoleSchema>;

const createRoleCommand = async (params: createRoleCommandParams) => {
  const command = await prisma.roles.create({
    data: {
      Name: params.Name,
      IsEnabled: params.IsEnabled,
    },
  });

  return command;
};

export default createRoleCommand;
