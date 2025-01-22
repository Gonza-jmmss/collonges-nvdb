import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getUserByUserNameQuery = async (userName: string) => {
  return await prisma.users.findFirstOrThrow({
    where: { UserName: userName },
    include: {
      Roles: true,
    },
  });
};

export default getUserByUserNameQuery;
