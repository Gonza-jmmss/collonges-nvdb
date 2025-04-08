"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DeleteLevelParams = {
  LevelId: number;
};

const disableLevelCommand = (params: DeleteLevelParams) => {
  const command = prisma.levels.update({
    where: { LevelId: params.LevelId },
    data: {
      IsEnabled: false,
    },
  });

  return command;
};

export default disableLevelCommand;
