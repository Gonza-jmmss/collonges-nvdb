"use server";

import { PrismaClient } from "@prisma/client";
import { LevelSchema } from "@/zodSchemas/levelSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type LevelParams = z.infer<typeof LevelSchema>;

const createLevelCommand = async (params: LevelParams) => {
  const command = await prisma.levels.create({
    data: {
      Name: params.Name,
      IsEnabled: params.IsEnabled,
    },
  });

  return command;
};

export default createLevelCommand;
