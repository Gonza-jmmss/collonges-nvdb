import { PrismaClient } from "@prisma/client";
import { CurrentLevelsMap } from "../levelsViewModel";
import getCurrentScholarPeriodQuery from "@/repositories/scholarPeriods/queries/getCurrentScholarPeriod";

const prisma = new PrismaClient();

const getCurrentLevelsQuery = async () => {
  const currentScholarPeriod = await getCurrentScholarPeriodQuery();

  const query = await prisma.levels.findMany({
    where: {
      IsEnabled: true,
      PeriodNumber: currentScholarPeriod.Number,
    },
  });

  const res = query.map((level: CurrentLevelsMap) => ({
    LevelId: level.LevelId,
    Name: level.Name,
    IsEnabled: level.IsEnabled,
  }));

  return res;
};

export default getCurrentLevelsQuery;
