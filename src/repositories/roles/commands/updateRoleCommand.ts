"use server";

import { PrismaClient } from "@prisma/client";
// import { Command } from "@/interfaces/command";
// import { RolesUpdateViewModel, RoleViewModel } from "../rolesViewModel";

const prisma = new PrismaClient();

// export class updateRoleCommand
//   implements Command<RolesUpdateViewModel, RoleViewModel>
// {
//   async execute(params: RolesUpdateViewModel): Promise<RoleViewModel> {
//     const updatedRole = await prisma.roles.update({
//       where: {
//         RoleId: params.RoleId,
//       },
//       data: {
//         Name: params.Name,
//       },
//     });

//     return {
//       RoleId: updatedRole.RoleId,
//       Name: updatedRole.Name,
//     };
//   }
// }

type UpdateRoleParams = {
  RoleId: number;
  Name: string;
};

const updateRoleCommand = async (params: UpdateRoleParams) => {
  return await prisma.roles.update({
    where: {
      RoleId: params.RoleId,
    },
    data: {
      Name: params.Name,
    },
  });
};

export default updateRoleCommand;
