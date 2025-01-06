"use server";

import { PrismaClient } from "@prisma/client";
// import { Command } from "@/interfaces/command";
// import { RolesDeleteViewModel, RoleViewModel } from "../rolesViewModel";

const prisma = new PrismaClient();

// export class deleteRoleCommand
//   implements Command<RolesDeleteViewModel, RoleViewModel>
// {
//   async execute(params: RolesDeleteViewModel): Promise<RoleViewModel> {
//     const deletedRole = await prisma.roles.delete({
//       where: {
//         RoleId: params.RoleId,
//       },
//     });

//     return {
//       RoleId: deletedRole.RoleId,
//       Name: deletedRole.Name,
//     };
//   }
// }

type DeleteRoleParams = {
  RoleId: number;
};

const deleteRoleCommand = async (params: DeleteRoleParams) => {
  return await prisma.roles.delete({
    where: {
      RoleId: params.RoleId,
    },
  });
};

export default deleteRoleCommand;
