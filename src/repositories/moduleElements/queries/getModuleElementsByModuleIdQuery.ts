"use server";

import { PrismaClient } from "@prisma/client";
import { ModuleElementViewModel } from "../moduleElementsViewModel";

const prisma = new PrismaClient();

type getModuleElementsByModuleIdQueryParams = {
  ModuleId: number;
};

const getModuleElementsByModuleIdQuery = async (
  params: getModuleElementsByModuleIdQueryParams,
) => {
  const query = await prisma.moduleElements.findMany({
    orderBy: [
      {
        Location: { sort: "asc", nulls: "last" },
      },
    ],
    where: { ModuleId: params.ModuleId },
  });

  const res = query.map((moduleElement: ModuleElementViewModel) => ({
    ModuleElementId: moduleElement.ModuleElementId,
    Name: moduleElement.Name,
    Path: moduleElement.Path,
    Icon: moduleElement.Icon,
    Description: moduleElement.Description,
    Location: moduleElement.Location,
  }));

  return res;
};

export default getModuleElementsByModuleIdQuery;
