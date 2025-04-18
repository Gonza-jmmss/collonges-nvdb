import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getActiveScholarYearQuery = async () => {
  return await prisma.scholarYears.findFirstOrThrow({
    where: { IsActive: true },
  });
};

export default getActiveScholarYearQuery;
