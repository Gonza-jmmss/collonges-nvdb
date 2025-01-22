"use server";

import { cache } from "react";
import { PrismaClient } from "@prisma/client";
import { ModulesViewModel } from "../modulesViewModel";

const prisma = new PrismaClient();

const getAllModulesQuery = cache(async () => {
  const query = await prisma.modules.findMany({
    orderBy: {
      Location: { sort: "asc", nulls: "last" },
    },
  });

  const res = query.map((module: ModulesViewModel) => ({
    ModuleId: module.ModuleId,
    Name: module.Name,
    Path: module.Path,
    Icon: module.Icon,
    Location: module.Location,
  }));

  return res;
});

export default getAllModulesQuery;
