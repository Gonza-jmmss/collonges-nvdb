"use server";

import { cache } from "react";
import { PrismaClient } from "@prisma/client";
import { ModuleElementsMapViewModel } from "../moduleElementsViewModel";

const prisma = new PrismaClient();

const getAllModuleElementsQuery = cache(async () => {
  const query = await prisma.moduleElements.findMany({
    orderBy: [
      {
        ModuleId: { sort: "desc", nulls: "last" },
      },
      {
        Location: { sort: "asc", nulls: "last" },
      },
    ],
    include: {
      Modules: true,
    },
  });

  const res = query.map((moduleElement: ModuleElementsMapViewModel) => ({
    ModuleElementId: moduleElement.ModuleElementId,
    Name: moduleElement.Name,
    Path: moduleElement.Path,
    Icon: moduleElement.Icon,
    Description: moduleElement.Description,
    ModuleId: moduleElement.Modules?.ModuleId,
    ModuleName: moduleElement.Modules?.Name,
    Location: moduleElement.Location,
  }));

  return res;
});

export default getAllModuleElementsQuery;
