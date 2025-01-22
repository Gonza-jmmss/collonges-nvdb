import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getModuleByIdQuery = async (moduleId: number) => {
  return await prisma.modules.findFirstOrThrow({
    where: { ModuleId: moduleId },
  });
};

export default getModuleByIdQuery;
