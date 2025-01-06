"use server";

import { PrismaClient } from "@prisma/client";
// import { Command } from "@/interfaces/command";
// import { RolesCreateViewModel, RoleViewModel } from "../rolesViewModel";

const prisma = new PrismaClient();

// export class createRoleCommand
//   implements Command<RolesCreateViewModel, RoleViewModel>
// {
//   async execute(params: RolesCreateViewModel): Promise<RoleViewModel> {
//     const createdRole = await prisma.roles.create({
//       data: {
//         Name: params.Name,
//       },
//     });

//     return {
//       RoleId: createdRole.RoleId,
//       Name: createdRole.Name,
//     };
//   }
// }

type CreateRoleParams = {
  Name: string;
};

const createRoleCommand = async (params: CreateRoleParams) => {
  console.log("createRoleCommand");
  const command = await prisma.roles.create({
    data: {
      Name: params.Name,
    },
  });
  console.log("command", command);
  return command;
};

export default createRoleCommand;
