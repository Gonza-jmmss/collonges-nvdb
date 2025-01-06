import { PrismaClient } from "@prisma/client";
// import { Query } from "@/interfaces/query";
import { RolesViewModel } from "../rolesViewModel";

const prisma = new PrismaClient();

// export class getAllRolesQuery implements Query<RolesViewModel[]> {
//   async execute(): Promise<RolesViewModel[]> {
//     const result = await prisma.roles.findMany({});

//     return result.map((roles: RolesViewModel) => ({
//       RoleId: roles.RoleId,
//       Name: roles.Name,
//     }));
//   }
// }

const getAllRolesQuery = async () => {
  const query = await prisma.roles.findMany({});

  const res = query.map((roles: RolesViewModel) => ({
    RoleId: roles.RoleId,
    Name: roles.Name,
  }));

  return res;
};

export default getAllRolesQuery;
