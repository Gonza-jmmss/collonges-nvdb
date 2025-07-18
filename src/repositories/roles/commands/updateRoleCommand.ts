"use server";

import { PrismaClient } from "@prisma/client";
import { RoleSchema } from "@/zodSchemas/roleSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type updateRoleCommandParams = z.infer<typeof RoleSchema>;

const updateRoleCommand = async (params: updateRoleCommandParams) => {
  return await prisma.roles.update({
    where: {
      RoleId: params.RoleId,
    },
    data: {
      Name: params.Name,
      IsEnabled: params.IsEnabled,
    },
  });
};

export default updateRoleCommand;
