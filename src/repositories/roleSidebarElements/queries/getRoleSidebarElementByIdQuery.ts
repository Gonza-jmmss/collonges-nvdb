import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getRoleSidebarElementByIdQuery = async (RoleSidebarElementId: number) => {
  return await prisma.roleSidebarElements.findFirstOrThrow({
    where: { RoleSidebarElementId: RoleSidebarElementId },
  });
};

export default getRoleSidebarElementByIdQuery;
