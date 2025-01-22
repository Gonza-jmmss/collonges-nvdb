import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getRoleByRoleIdQuery = async (roleId: number) => {
  return await prisma.roles.findFirstOrThrow({
    where: { RoleId: roleId },
  });
};

export default getRoleByRoleIdQuery;
