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

type getRoleModuleElementsByRoleIdQueyParamsType = {
  RoleId: number;
};

const getRoleModuleElementsByRoleIdQuey = cache(
  async (
    params: getRoleModuleElementsByRoleIdQueyParamsType,
  ): Promise<RoleModuleElementsGroupedViewModel | null> => {
    const query = await prisma.roleModuleElements.findMany({
      orderBy: [
        { Modules: { Location: "asc" } },
        { ModuleElements: { Location: "asc" } },
      ],
      where: { RoleId: params.RoleId },
      include: {
        ModuleElements: true,
        Modules: true,
        Roles: true,
      },
    });

    // If no records found, return null
    if (query.length === 0) {
      return null;
    }

    const allModules = await getAllModulesQuery();

    // Use the first record to get the role information
    const firstRecord = query[0];
    const roleData: RoleModuleElementsGroupedViewModel = {
      RoleId: firstRecord.Roles.RoleId,
      RoleName: firstRecord.Roles.Name,
      Modules: [],
      ModuleElements: [],
    };

    // Process each record
    query.forEach((roleModuleElement: RoleModuleElementsMapViewModel) => {
      // Only create and push ModuleEntry if Modules exists and has a ModuleId
      if (roleModuleElement.Modules?.ModuleId) {
        const moduleEntry: RoleModulesByRole = {
          RoleModuleElementId: roleModuleElement.RoleModuleElementId,
          ModuleName: roleModuleElement.Modules.Name || null,
          ModuleId: roleModuleElement.Modules.ModuleId,
          Path: roleModuleElement.Modules.Path || "",
          Icon: roleModuleElement.Modules.Icon,
          IsShortcut: roleModuleElement.IsShortcut,
        };
        roleData.Modules.push(moduleEntry);
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
          IsShortcut: roleModuleElement.IsShortcut,
        };
        roleData.ModuleElements.push(moduleElementEntry);
      }
    });

    // Sort ModuleElements by path to group similar paths together
    const getBasePath = (path: string | null): string => {
      if (!path) return "";
      // Extract the first segment of the path (e.g., '/settings/' from '/settings/users')
      const match = path.match(/^(\/[^/]+\/)/);
      return match ? match[1] : path;
    };

    // Sort ModuleElements by their base path and then by the full path
    roleData.ModuleElements.sort((a, b) => {
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
    roleData.Modules.sort((a, b) => {
      const pathA = a.Path || "";
      const pathB = b.Path || "";
      return pathA.localeCompare(pathB);
    });

    return roleData;
  },
);

export default getRoleModuleElementsByRoleIdQuey;
