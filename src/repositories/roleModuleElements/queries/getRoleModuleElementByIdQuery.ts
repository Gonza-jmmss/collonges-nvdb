import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getRoleModuleElementByIdQuery = async (RoleModuleElementId: number) => {
  return await prisma.roleModuleElements.findFirstOrThrow({
    where: { RoleModuleElementId: RoleModuleElementId },
  });
};

export default getRoleModuleElementByIdQuery;
