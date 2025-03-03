import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getScholarYearByIdQuery = async (scholarYearId: number) => {
  return await prisma.scholarYears.findFirstOrThrow({
    where: { ScholarYearId: scholarYearId },
  });
};

export default getScholarYearByIdQuery;
