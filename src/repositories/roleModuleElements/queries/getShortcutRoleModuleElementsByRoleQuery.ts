"use server";

import { PrismaClient } from "@prisma/client";
import { getShortcutRoleModuleElementsByRoleQueryMap } from "../roleModuleElementsViewModel";

const prisma = new PrismaClient();

type getShortcutRoleModuleElementsByRoleQueryParams = {
  RoleId: number;
};

const getShortcutRoleModuleElementsByRoleQuery = async (
  params: getShortcutRoleModuleElementsByRoleQueryParams,
) => {
  const query = await prisma.roleModuleElements.findMany({
    where: {
      RoleId: params.RoleId,
      IsShortcut: true,
    },
    include: {
      ModuleElements: true,
    },
  });

  const res = query.map(
    (roleModuleElement: getShortcutRoleModuleElementsByRoleQueryMap) => ({
      RoleModuleElementId: roleModuleElement.RoleModuleElementId,
      ModuleElementId: roleModuleElement.ModuleElements?.ModuleElementId,
      Name: roleModuleElement.ModuleElements?.Name,
      Path: roleModuleElement.ModuleElements?.Path,
      Icon: roleModuleElement.ModuleElements
        ? roleModuleElement.ModuleElements.Icon
        : "MdOutlineNotInterested",
    }),
  );

  return res;
};

export default getShortcutRoleModuleElementsByRoleQuery;
