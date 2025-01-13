"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DeleteModuleElementParams = {
  ModuleElementId: number;
};

const deleteModuleElementCommand = async (
  params: DeleteModuleElementParams,
) => {
  return await prisma.moduleElements.delete({
    where: {
      ModuleElementId: params.ModuleElementId,
    },
  });
};

export default deleteModuleElementCommand;
