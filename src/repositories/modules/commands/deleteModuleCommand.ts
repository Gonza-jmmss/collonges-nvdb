"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DeleteModuleParams = {
  ModuleId: number;
};

const deleteModuleCommand = async (params: DeleteModuleParams) => {
  return await prisma.modules.delete({
    where: {
      ModuleId: params.ModuleId,
    },
  });
};

export default deleteModuleCommand;
