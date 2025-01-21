import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getUserByUserIdQuery = async (userId: number) => {
  const query = await prisma.users.findFirstOrThrow({
    where: { UserId: userId },
    include: {
      Roles: true,
    },
  });

  const res = {
    UserId: query.UserId,
    UserName: query.UserName,
    RoleId: query.Roles.RoleId,
    RoleName: query.Roles.Name,
    IsEnabled: query.IsEnabled,
  };

  console.log("getUserByUserIdQuery", res);
  return res;
};

export default getUserByUserIdQuery;
