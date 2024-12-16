import { PrismaClient } from "@prisma/client";
import { Query } from "@/interfaces/query";
import { UserViewModel } from "@/repositories/users/usersViewModel";

const prisma = new PrismaClient();

export class getUser implements Query<UserViewModel, string> {
  async execute(userName: string): Promise<UserViewModel> {
    const result = await prisma.users.findFirstOrThrow({
      where: { UserName: userName },
    });
    return result;
  }
}
