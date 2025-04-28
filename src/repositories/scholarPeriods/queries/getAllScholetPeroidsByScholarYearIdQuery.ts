import { PrismaClient } from "@prisma/client";
import { ScholarPeriodsByScholarYearIdMap } from "../scholarPeriodsViewModel";

const prisma = new PrismaClient();

type getAllScholarPeriodsByScholarYearIdQueryParams = {
  ScholarYearId: number;
};

const getAllScholarPeriodsByScholarYearIdQuery = async (
  params: getAllScholarPeriodsByScholarYearIdQueryParams,
) => {
  const query = await prisma.scholarPeriods.findMany({
    where: { ScholarYearId: params.ScholarYearId },
    orderBy: [{ IsActive: "desc" }, { Number: "desc" }, { Name: "desc" }],
  });

  const res = query.map((scholarPeriod: ScholarPeriodsByScholarYearIdMap) => ({
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

export default getAllScholarPeriodsByScholarYearIdQuery;
