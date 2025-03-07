"use server";

import { PrismaClient } from "@prisma/client";
import { LevelSchema } from "@/zodSchemas/levelSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type LevelParams = z.infer<typeof LevelSchema>;

const updateLevelCommand = (params: LevelParams) => {
  const command = prisma.levels.update({
    where: { LevelId: params.LevelId },
    data: {
      Name: params.Name,
      IsEnabled: params.IsEnabled,
    },
  });

  return command;
};

export default updateLevelCommand;
