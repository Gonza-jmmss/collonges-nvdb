import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getCurrentScholarPeriodQuery = async () => {
  return await prisma.scholarPeriods.findFirstOrThrow({
    where: { IsActive: true },
  });
};

export default getCurrentScholarPeriodQuery;
