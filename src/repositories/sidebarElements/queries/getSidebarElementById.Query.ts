import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getSidebarElementByIdQuery = async (SidebarElementId: number) => {
  return await prisma.sidebarElements.findFirstOrThrow({
    where: { SidebarElementId: SidebarElementId },
  });
};

export default getSidebarElementByIdQuery;
