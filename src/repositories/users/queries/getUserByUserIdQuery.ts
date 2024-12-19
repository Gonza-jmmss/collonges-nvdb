import { PrismaClient } from "@prisma/client";
import { Query } from "@/interfaces/query";
import { UserViewModel } from "@/repositories/users/usersViewModel";

const prisma = new PrismaClient();

export class getUserByUserIdQuery implements Query<UserViewModel, number> {
  async execute(userId: number): Promise<UserViewModel> {
    const result = await prisma.users.findFirstOrThrow({
      where: { UserId: userId },
      include: {
        Roles: true,
      },
    });
    return {
      UserId: result.UserId,
      UserName: result.UserName,
      Password: "",
      RoleId: result.Roles.RoleId,
      RoleName: result.Roles.Name,
    };
  }
}
