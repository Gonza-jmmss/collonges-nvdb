import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type getYearPeriodByIdQueryParamsType = {
  YearPeriodId: number;
};

const getYearPeriodByIdQuery = async (
  params: getYearPeriodByIdQueryParamsType,
) => {
  const query = await prisma.yearPeriods.findFirstOrThrow({
    where: { YearPeriodId: params.YearPeriodId },
  });

  const res = {
    YearPeriodId: query.YearPeriodId,
    Name: query.Name,
    PeriodType: query.PeriodType,
    ScholarYearId: query.ScholarYearId,
    IsEnabled: query.IsEnabled,
  };

  return res;
};

export default getYearPeriodByIdQuery;
