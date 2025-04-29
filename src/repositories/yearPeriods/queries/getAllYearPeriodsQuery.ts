import { PrismaClient } from "@prisma/client";
import { yearPeriodsMap } from "../yearPeriodsViewModel";

const prisma = new PrismaClient();

type getAllYearPeriodsQueryParamsType = {
  IsEnabled: boolean;
};

const getAllYearPeriodsQuery = async (
  params: getAllYearPeriodsQueryParamsType,
) => {
  const query = await prisma.yearPeriods.findMany({
    orderBy: { CreatedAt: "desc" },
    where: { IsEnabled: params.IsEnabled },
    include: { ScholarYears: true, Students: true },
  });

  const res = query.map((yearPeriod: yearPeriodsMap) => ({
    YearPeriodId: yearPeriod.YearPeriodId,
    Name: yearPeriod.Name,
    PeriodType: yearPeriod.PeriodType,
    ScholarYearId: yearPeriod.ScholarYearId,
    ScholarYearName: yearPeriod.ScholarYears.Name,
    IsEnabled: yearPeriod.IsEnabled,
    IsDeletable: yearPeriod.Students.length === 0,
  }));

  return res;
};

export default getAllYearPeriodsQuery;
