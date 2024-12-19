import { PrismaClient } from "@prisma/client";
import { Query } from "@/interfaces/query";
import { UserViewModel } from "@/repositories/users/usersViewModel";

const prisma = new PrismaClient();

export class getUserByUserNameQuery implements Query<UserViewModel, string> {
  async execute(userName: string): Promise<UserViewModel> {
    const result = await prisma.users.findFirstOrThrow({
      where: { UserName: userName },
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
