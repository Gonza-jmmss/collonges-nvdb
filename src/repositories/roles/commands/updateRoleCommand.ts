import { PrismaClient } from "@prisma/client";
import { Command } from "@/interfaces/command";
import { RolesUpdateViewModel, RoleViewModel } from "../rolesViewModel";

const prisma = new PrismaClient();

export class updateRoleCommand
  implements Command<RolesUpdateViewModel, RoleViewModel>
{
  async execute(params: RolesUpdateViewModel): Promise<RoleViewModel> {
    const updatedRole = await prisma.roles.update({
      where: {
        RoleId: params.RoleId,
      },
      data: {
        Name: params.Name,
      },
    });

    return {
      RoleId: updatedRole.RoleId,
      Name: updatedRole.Name,
    };
  }
}
