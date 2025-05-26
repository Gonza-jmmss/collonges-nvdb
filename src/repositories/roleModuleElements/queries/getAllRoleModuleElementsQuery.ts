"use server";

import { cache } from "react";
import { PrismaClient } from "@prisma/client";
import getAllModulesQuery from "@/repositories/modules/queries/getAllModulesQuery";
import {
  RoleModuleElementsMapViewModel,
  RoleModuleElementsGroupedViewModel,
  RoleModulesByRole,
  RoleModuleElemensByRole,
} from "../roleModuleElementsViewModel";

const prisma = new PrismaClient();

const getAllRoleModuleElementsQuery = cache(async () => {
  const query = await prisma.roleModuleElements.findMany({
    orderBy: [
      { Modules: { Location: "asc" } },
      { ModuleElements: { Location: "asc" } },
    ],
    include: {
      ModuleElements: true,
      Modules: true,
      Roles: true,
    },
  });

  const allModules = await getAllModulesQuery();

  const groupMap: Record<string, RoleModuleElementsGroupedViewModel> = {};

  // Process each record
  query.forEach((roleModuleElement: RoleModuleElementsMapViewModel) => {
    const roleId = roleModuleElement.Roles.RoleId;

    // If this description is not in our map yet, create the base object
    if (!groupMap[roleId]) {
      groupMap[roleId] = {
        RoleId: roleModuleElement.Roles.RoleId,
        RoleName: roleModuleElement.Roles.Name,
        Modules: [], // Start with empty array
        ModuleElements: [], // Start with empty array
      };
    }

    // Only create and push ModuleEntry if Modules exists and has a ModuleId
    if (roleModuleElement.Modules?.ModuleId) {
      const moduleEntry: RoleModulesByRole = {
        RoleModuleElementId: roleModuleElement.RoleModuleElementId,
        ModuleName: roleModuleElement.Modules.Name || null,
        ModuleId: roleModuleElement.Modules.ModuleId,
        Path: roleModuleElement.Modules.Path || "",
        Icon: roleModuleElement.Modules.Icon,
      };
      groupMap[roleId].Modules.push(moduleEntry);
    }

    // Only create and push ModuleElementEntry if ModuleElements exists and has a ModuleElementId
    if (roleModuleElement.ModuleElements?.ModuleElementId) {
      const moduleElementEntry: RoleModuleElemensByRole = {
        RoleModuleElementId: roleModuleElement.RoleModuleElementId,
        ModuleElementName: roleModuleElement.ModuleElements.Name || null,
        ModuleElementId: roleModuleElement.ModuleElements.ModuleElementId,
        Path: roleModuleElement.ModuleElements.Path || "",
        Icon: roleModuleElement.ModuleElements.Icon,
        ModuleName:
          allModules.find(
            (x) => x.ModuleId === roleModuleElement.ModuleElements?.ModuleId,
          )?.Name || "",
      };
      groupMap[roleId].ModuleElements.push(moduleElementEntry);
    }
  });

  // For each role, sort ModuleElements by path to group similar paths together
  for (const roleId in groupMap) {
    // Extract the base path (like '/settings/', '/students/') from each path
    const getBasePath = (path: string | null): string => {
      if (!path) return "";
      // Extract the first segment of the path (e.g., '/settings/' from '/settings/users')
      const match = path.match(/^(\/[^/]+\/)/);
      return match ? match[1] : path;
    };

    // Sort ModuleElements by their base path and then by the full path
    groupMap[roleId].ModuleElements.sort((a, b) => {
      const pathA = a.Path || "";
      const pathB = b.Path || "";
      const basePathA = getBasePath(pathA);
      const basePathB = getBasePath(pathB);

      // First compare base paths
      if (basePathA !== basePathB) {
        return basePathA.localeCompare(basePathB);
      }

      // If base paths are the same, compare full paths
      return pathA.localeCompare(pathB);
    });

    // Also sort Modules by path for consistency
    groupMap[roleId].Modules.sort((a, b) => {
      const pathA = a.Path || "";
      const pathB = b.Path || "";
      return pathA.localeCompare(pathB);
    });
  }

  // Convert map to array
  const result = Object.values(groupMap);

  return result;
});

export default getAllRoleModuleElementsQuery;

// "use server";

// import { cache } from "react";
// import { PrismaClient } from "@prisma/client";
// import {
//   RoleModuleElementsMapViewModel,
//   RoleModuleElementsGroupedViewModel,
//   RoleModulesByRole,
//   RoleModuleElemensByRole,
// } from "../roleModuleElementsViewModel";

// const prisma = new PrismaClient();

// const getAllRoleModuleElementsQuery = cache(async () => {
//   const query = await prisma.roleModuleElements.findMany({
//     orderBy: [
//       { Modules: { Location: "asc" } },
//       { ModuleElements: { Location: "asc" } },
//     ],
//     include: {
//       ModuleElements: true,
//       Modules: true,
//       Roles: true,
//     },
//   });

//   const groupMap: Record<string, RoleModuleElementsGroupedViewModel> = {};

//   // Process each record
//   query.forEach((roleModuleElement: RoleModuleElementsMapViewModel) => {
//     const roleId = roleModuleElement.Roles.RoleId;

//     // If this role is not in our map yet, create the base object
//     if (!groupMap[roleId]) {
//       groupMap[roleId] = {
//         RoleId: roleModuleElement.Roles.RoleId,
//         RoleName: roleModuleElement.Roles.Name,
//         RoleElements: [
//           {
//             ModuleElements: [],
//             Modules: [],
//           },
//         ],
//       };
//     }

//     // Get reference to the first (and only) RoleElements entry
//     const roleElementsEntry = groupMap[roleId].RoleElements[0];

//     // Only create and push ModuleEntry if Modules exists and has a ModuleId
//     if (roleModuleElement.Modules?.ModuleId) {
//       const moduleEntry: RoleModulesByRole = {
//         RoleModuleElementId: roleModuleElement.RoleModuleElementId,
//         ModuleName: roleModuleElement.Modules.Name || null,
//         ModuleId: roleModuleElement.Modules.ModuleId,
//         Path: roleModuleElement.Modules.Path || "",
//       };
//       roleElementsEntry.Modules.push(moduleEntry);
//     }

//     // Only create and push ModuleElementEntry if ModuleElements exists and has a ModuleElementId
//     if (roleModuleElement.ModuleElements?.ModuleElementId) {
//       const moduleElementEntry: RoleModuleElemensByRole = {
//         RoleModuleElementId: roleModuleElement.RoleModuleElementId,
//         ModuleElementName: roleModuleElement.ModuleElements.Name || null,
//         ModuleElementId: roleModuleElement.ModuleElements.ModuleElementId,
//         Path: roleModuleElement.ModuleElements.Path || "",
//       };
//       roleElementsEntry.ModuleElements.push(moduleElementEntry);
//     }
//   });

//   // For each role, sort ModuleElements by path to group similar paths together
//   for (const roleId in groupMap) {
//     // Extract the base path (like '/settings/', '/students/') from each path
//     const getBasePath = (path: string | null): string => {
//       if (!path) return "";
//       // Extract the first segment of the path (e.g., '/settings/' from '/settings/users')
//       const match = path.match(/^(\/[^/]+\/)/);
//       return match ? match[1] : path;
//     };

//     const roleElementsEntry = groupMap[roleId].RoleElements[0];

//     // Sort ModuleElements by their base path and then by the full path
//     roleElementsEntry.ModuleElements.sort((a, b) => {
//       const pathA = a.Path || "";
//       const pathB = b.Path || "";
//       const basePathA = getBasePath(pathA);
//       const basePathB = getBasePath(pathB);

//       // First compare base paths
//       if (basePathA !== basePathB) {
//         return basePathA.localeCompare(basePathB);
//       }

//       // If base paths are the same, compare full paths
//       return pathA.localeCompare(pathB);
//     });

//     // Also sort Modules by path for consistency
//     roleElementsEntry.Modules.sort((a, b) => {
//       const pathA = a.Path || "";
//       const pathB = b.Path || "";
//       return pathA.localeCompare(pathB);
//     });
//   }

//   // Convert map to array
//   const result = Object.values(groupMap);

//   return result;
// });

// export default getAllRoleModuleElementsQuery;
