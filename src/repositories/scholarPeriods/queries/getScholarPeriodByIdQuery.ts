import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getScholarPeriodByIdQuery = async (scholarPeriodId: number) => {
  return await prisma.scholarPeriods.findFirstOrThrow({
    where: { ScholarPeriodId: scholarPeriodId },
  });
};

export default getScholarPeriodByIdQuery;
