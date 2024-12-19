import { PrismaClient } from "@prisma/client";
import { Command } from "@/interfaces/command";
import { UserCreateInterface, UserCreateViewModel } from "../usersViewModel";

const prisma = new PrismaClient();

export class createUserCommand
  implements Command<UserCreateInterface, UserCreateViewModel>
{
  async execute(params: UserCreateInterface): Promise<UserCreateViewModel> {
    const userCreated = await prisma.users.create({
      data: {
        UserName: params.UserName,
        Password: params.Password,
        RoleId: params.RoleId,
      },
    });

    return {
      UserId: userCreated.UserId,
      UserName: userCreated.UserName,
      Password: "",
      RoleId: userCreated.RoleId,
    };
  }
}
