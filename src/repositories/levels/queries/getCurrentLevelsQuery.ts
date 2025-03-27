import { PrismaClient } from "@prisma/client";
import { CurrentLevelsMap } from "../levelsViewModel";

const prisma = new PrismaClient();

const getCurrentLevelsQuery = async () => {
  const query = await prisma.levels.findMany({
    where: { IsEnabled: true },
  });

  const res = query.map((level: CurrentLevelsMap) => ({
    LevelId: level.LevelId,
    Name: level.Name,
    IsEnabled: level.IsEnabled,
  }));

  return res;
};

export default getCurrentLevelsQuery;
