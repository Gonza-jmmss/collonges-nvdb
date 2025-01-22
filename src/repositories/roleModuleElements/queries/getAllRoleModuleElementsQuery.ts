"use server";

import { cache } from "react";
import { PrismaClient } from "@prisma/client";
import { RoleModuleElementsMapViewModel } from "../roleModuleElementsViewModel";

const prisma = new PrismaClient();

const getAllRoleModuleElementsQuery = cache(async () => {
  const query = await prisma.roleModuleElements.findMany({
    include: {
      ModuleElements: true,
      Modules: true,
      Roles: true,
    },
  });

  const res = query.map(
    (roleModuleElement: RoleModuleElementsMapViewModel) => ({
      RoleModuleElementId: roleModuleElement.RoleModuleElementId,
      ModuleElementName: roleModuleElement.ModuleElements?.Name,
      ModuleElementId: roleModuleElement.ModuleElements?.ModuleElementId,
      ModuleName: roleModuleElement.Modules?.Name,
      ModuleId: roleModuleElement.Modules?.ModuleId,
      Path:
        roleModuleElement.ModuleElements?.Path ||
        roleModuleElement.Modules?.Path ||
        "",
      RoleName: roleModuleElement.Roles.Name,
      RoleId: roleModuleElement.Roles.RoleId,
    }),
  );

  return res;
});

export default getAllRoleModuleElementsQuery;

// "use server";

// import { unstable_cache } from 'next/cache';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// const getAllRoleModuleElementsQuery = async () => {
//   // Using unstable_cache with a specific key and tags
//   return unstable_cache(
//     async () => {
//       const query = await prisma.roleModuleElements.findMany({
//         include: {
//           ModuleElements: true,
//           Roles: true,
//         },
//       });
//       return query;
//     },
//     ['role-module-elements'], // Cache key
//     {
//       tags: ['role-module-elements'], // Cache tag for revalidation
//       revalidate: 3600, // Cache for 1 hour (optional)
//     }
//   )();
// };

// export default getAllRoleModuleElementsQuery;
