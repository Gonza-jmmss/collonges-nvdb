import { PrismaClient } from "@prisma/client";
import { Query } from "@/interfaces/query";
import { UserViewModel, UsersViewModel } from "../usersViewModel";

const prisma = new PrismaClient();

export class getAllUsersQuery implements Query<UserViewModel[]> {
  async execute(): Promise<UserViewModel[]> {
    const result = await prisma.users.findMany({
      include: {
        Roles: true,
      },
    });

    return result.map((users: UsersViewModel) => ({
      UserId: users.UserId,
      UserName: users.UserName,
      Password: "",
      RoleId: users.Roles.RoleId,
      RoleName: users.Roles.Name,
    }));
  }
}
