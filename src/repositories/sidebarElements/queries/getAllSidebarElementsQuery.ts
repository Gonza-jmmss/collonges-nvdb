"use server";

import { cache } from "react";
import { PrismaClient } from "@prisma/client";
import { SidebarElementsMapViewModel } from "../sidebarElementsViewModel";

const prisma = new PrismaClient();

const getAllSidebarElementsQuery = cache(async () => {
  const query = await prisma.sidebarElements.findMany({
    orderBy: {
      Location: { sort: "asc", nulls: "last" },
    },
    include: {
      Modules: true,
    },
  });

  const res = query.map((sidebarElement: SidebarElementsMapViewModel) => ({
    SidebarElementId: sidebarElement.SidebarElementId,
    Name: sidebarElement.Name,
    Path: sidebarElement.Path,
    Icon: sidebarElement.Icon,
    Description: sidebarElement.Description,
    ModuleId: sidebarElement.Modules?.ModuleId,
    ModuleName: sidebarElement.Modules?.Name,
    Location: sidebarElement.Location,
  }));

  return res;
});

export default getAllSidebarElementsQuery;
