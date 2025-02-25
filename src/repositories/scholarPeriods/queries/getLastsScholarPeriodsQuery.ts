import { PrismaClient } from "@prisma/client";
import { ScholarPeriodMap } from "../scholarPeriodsViewModel";

const prisma = new PrismaClient();

const getLastsScholarPeriodsQuery = async () => {
  const query = await prisma.scholarPeriods.findMany({
    take: 10,
    orderBy: { Name: "desc" },
  });

  const res = query.map((scholarPeriod: ScholarPeriodMap) => ({
    ScholarPeriodId: scholarPeriod.ScholarPeriodId,
    Name: scholarPeriod.Name,
    Number: scholarPeriod.Number,
    FromDate: scholarPeriod.FromDate,
    ToDate: scholarPeriod.ToDate,
    IsActive: scholarPeriod.IsActive,
    ScholarYearId: scholarPeriod.ScholarYearId,
  }));

  return res;
};

export default getLastsScholarPeriodsQuery;
