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

  // Filter the ModuleElementsIDs to update
  const moduleElementsToUpdate = params.ModuleElements?.filter(
    (moduleElement) =>
      moduleElement.ModuleElementId !== null &&
      studentModuleElementsIds?.includes(moduleElement.ModuleElementId),
  );

  //////////////
  // Get RoleModuleElements to create
  //////////////
  let roleModuleElementsToCreate: {
    RoleId: number;
    ModuleElementId: number | null;
    ModuleId: number | null;
    IsShortcut: boolean | null;
  }[] = [];

  if (modulesToCreate && modulesToCreate.length > 0) {
    modulesToCreate.forEach((element) => {
      roleModuleElementsToCreate.push({
        RoleId: params.RoleId,
        ModuleId: element,
        ModuleElementId: null,
        IsShortcut: null,
      });
    });
  }

  if (moduleElementsToCreate && moduleElementsToCreate.length > 0) {
    moduleElementsToCreate.forEach((element) => {
      roleModuleElementsToCreate.push({
        RoleId: params.RoleId,
        ModuleElementId: element,
        ModuleId: null,
        IsShortcut:
          params.ModuleElements?.find((x) => x.ModuleElementId === element)
            ?.IsShortcut || false,
      });
    });
  }

  //////////////
  // Get elements to delete
  //////////////
  const roleModuleElementsToDelete =
    await getRoleModuleElementsByModulesAndModuleElmenstIdsQuery({
      RoleId: params.RoleId,
      ModuleIds: modulesToDelete,
      ModuleElementIds: moduleElementsToDelete,
    });

  //////////////
  // Transaction for data integrity
  //////////////
  const transaction = await prisma.$transaction(async (tx) => {
    // Execute creates
    const creates =
      roleModuleElementsToCreate.length > 0
        ? await tx.roleModuleElements.createMany({
            data: roleModuleElementsToCreate,
          })
        : { count: 0 };

    // Execute deletes
    const deletes =
      roleModuleElementsToDelete.length > 0
        ? await tx.roleModuleElements.deleteMany({
            where: {
              RoleModuleElementId: {
                in: roleModuleElementsToDelete.map(
                  (x) => x.RoleModuleElementId,
                ),
              },
            },
          })
        : { count: 0 };

    // Execute updates
    const updatePromises =
      moduleElementsToUpdate
        ?.map((element) => {
          if (element.RoleModuleElementId !== null) {
            return tx.roleModuleElements.update({
              where: { RoleModuleElementId: element.RoleModuleElementId },
              data: {
                RoleId: params.RoleId,
                ModuleElementId: element.ModuleElementId,
                ModuleId: null,
                IsShortcut: element.IsShortcut,
                UpdatedAt: new Date(),
              },
            });
          }
          return null;
        })
        .filter(Boolean) || [];

    const updates =
      updatePromises.length > 0 ? await Promise.all(updatePromises) : [];

    return {
      creates,
      deletes,
      updates,
    };
  });

  return {
    success: true,
    created: transaction.creates.count,
    deleted: transaction.deletes.count,
    updated: transaction.updates.length,
    transaction: transaction,
  };
};

export default updateRoleModuleElementCommand;
