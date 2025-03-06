import { PrismaClient } from "@prisma/client";
import { ScholarYearMap } from "../scholarYearsViewModel";

const prisma = new PrismaClient();

const getLastsScholarYearsWithPeriodsQuery = async () => {
  const query = await prisma.scholarYears.findMany({
    take: 10,
    orderBy: { Name: "desc" },
    where: {
      ScholarPeriods: {
        some: {}, // Empty object means "at least one record exists"
      },
    },
  });

  const res = query.map((scholarYear: ScholarYearMap) => ({
    ScholarYearId: scholarYear.ScholarYearId,
    Name: scholarYear.Name,
    FromDate: scholarYear.FromDate,
    ToDate: scholarYear.ToDate,
    IsActive: scholarYear.IsActive,
  }));

  return res;
};

export default getLastsScholarYearsWithPeriodsQuery;
