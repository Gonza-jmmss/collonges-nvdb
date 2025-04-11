import { PrismaClient } from "@prisma/client";
import { ScholarPeriodMap } from "../scholarPeriodsViewModel";

const prisma = new PrismaClient();

type getLastsScholarPeriodsQueryParamsType = {
  ScholarYearId?: number | null;
};

const getLastsScholarPeriodsQuery = async (
  params: getLastsScholarPeriodsQueryParamsType,
) => {
  const query = await prisma.scholarPeriods.findMany({
    take: 10,
    where: {
      ...(params.ScholarYearId &&
        params.ScholarYearId !== null && {
          ScholarYearId: params.ScholarYearId,
        }),
    },
    orderBy: [{ IsActive: "desc" }, { Number: "desc" }, { Name: "desc" }],
    include: {
      ScholarYears: true,
    },
  });

  const res = query.map((scholarPeriod: ScholarPeriodMap) => ({
    ScholarPeriodId: scholarPeriod.ScholarPeriodId,
    Name: scholarPeriod.Name,
    Number: scholarPeriod.Number,
    FromDate: scholarPeriod.FromDate,
    ToDate: scholarPeriod.ToDate,
    IsActive: scholarPeriod.IsActive,
    ScholarYearId: scholarPeriod.ScholarYearId,
    ScholarYearName: scholarPeriod.ScholarYears.Name,
  }));

  return res;
};

export default getLastsScholarPeriodsQuery;
