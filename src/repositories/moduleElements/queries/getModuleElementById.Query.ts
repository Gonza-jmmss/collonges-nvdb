import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getModuleElementByIdQuery = async (ModuleElementId: number) => {
  return await prisma.moduleElements.findFirstOrThrow({
    where: { ModuleElementId: ModuleElementId },
  });
};

export default getModuleElementByIdQuery;
