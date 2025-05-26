"use server";

import { PrismaClient } from "@prisma/client";
import { RoleModuleElementSchema } from "@/zodSchemas/roleModuleElementSchema";
import getAllModulesOfRoleModuleElementsByRoleIdQuery from "../queries/getAllModulesOfRoleModuleElementsByRoleIdQuery";
import getAllModuleElementsOfRoleModuleElementsByRoleIdQuery from "../queries/getAllModuleElementsOfRoleModuleElementsByRoleIdQuery";
import getRoleModuleElementsByModulesAndModuleElmenstIdsQuery from "../queries/getRoleModuleElementsByModulesAndModuleElmenstIdsQuery";
import { z } from "zod";

const prisma = new PrismaClient();

type UpdateRoleModuleElementParams = z.infer<typeof RoleModuleElementSchema>;

const updateRoleModuleElementCommand = async (
  params: UpdateRoleModuleElementParams,
) => {
  //////////////
  // Modules
  //////////////
  const roleModules = await getAllModulesOfRoleModuleElementsByRoleIdQuery({
    RoleId: params.RoleId,
  });

  // creating ModulesIDs arrays
  const paramsModulesIds = params.Modules?.map((x) => x.ModuleId);
  const studentModulesIds = roleModules.map((x) => x.ModuleId);

  // Filter the ModulesIDs to create
  const modulesToCreate = paramsModulesIds?.filter(
    (module) => !studentModulesIds?.includes(module),
  );

  // Filter the ModulesIDs to delete
  const modulesToDelete = studentModulesIds.filter(
    (module) => !paramsModulesIds?.includes(module),
  );

  //////////////
  // ModuleElements
  //////////////
  const roleModuleElements =
    await getAllModuleElementsOfRoleModuleElementsByRoleIdQuery({
      RoleId: params.RoleId,
    });

  // creating ModuleElementsIDs arrays
  const paramsModuleElementsIds = params.ModuleElements?.map(
    (x) => x.ModuleElementId,
  );
  const studentModuleElementsIds = roleModuleElements.map(
    (x) => x.ModuleElementId,
  );

  // Filter the ModuleElementsIDs to create
  const moduleElementsToCreate = paramsModuleElementsIds?.filter(
    (moduleElement) => !studentModuleElementsIds?.includes(moduleElement),
  );

  // Filter the ModuleElementsIDs to delete
  const moduleElementsToDelete = studentModuleElementsIds.filter(
    (moduleElement) => !paramsModuleElementsIds?.includes(moduleElement),
  );

  //////////////
  // Create RoleModuleElements
  //////////////
  let roleModuleElementsToCreate: {
    RoleId: number;
    ModuleElementId: number | null;
    ModuleId: number | null;
  }[] = [];

  if (modulesToCreate && modulesToCreate.length > 0) {
    modulesToCreate.forEach((element) => {
      roleModuleElementsToCreate.push({
        RoleId: params.RoleId,
        ModuleId: element,
        ModuleElementId: null,
      });
    });
  }

  if (moduleElementsToCreate && moduleElementsToCreate.length > 0) {
    moduleElementsToCreate.forEach((element) => {
      roleModuleElementsToCreate.push({
        RoleId: params.RoleId,
        ModuleElementId: element,
        ModuleId: null,
      });
    });
  }

  const createRoleModuleElements = await prisma.roleModuleElements.createMany({
    data: roleModuleElementsToCreate,
  });

  //////////////
  // Delete RoleModuleElements
  //////////////
  const roleModuleElementsToDelete =
    await getRoleModuleElementsByModulesAndModuleElmenstIdsQuery({
      RoleId: params.RoleId,
      ModuleIds: modulesToDelete,
      ModuleElementIds: moduleElementsToDelete,
    });

  const deleteRoleModuleElements = await prisma.roleModuleElements.deleteMany({
    where: {
      RoleModuleElementId: {
        in: roleModuleElementsToDelete.map((x) => x.RoleModuleElementId),
      },
    },
  });

  //////////////
  // transaction for update data
  //////////////
  const transaction = await prisma.$transaction(async () => [
    createRoleModuleElements,
    deleteRoleModuleElements,
  ]);

  return transaction;
};

export default updateRoleModuleElementCommand;
