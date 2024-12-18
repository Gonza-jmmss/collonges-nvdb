import { PrismaClient } from "@prisma/client";
import { Query } from "@/interfaces/query";
import { RoleViewModel } from "@/repositories/roles/rolesViewModel";

const prisma = new PrismaClient();

export class getRoleByRoleIdQuery implements Query<RoleViewModel, number> {
  async execute(roleId: number): Promise<RoleViewModel> {
    const result = await prisma.roles.findFirstOrThrow({
      where: { RoleId: roleId },
    });
    return result;
  }
}
