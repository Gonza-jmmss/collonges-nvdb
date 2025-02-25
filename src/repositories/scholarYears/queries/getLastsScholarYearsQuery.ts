import { PrismaClient } from "@prisma/client";
import { ScholarYearMap } from "../scholarYearsViewModel";

const prisma = new PrismaClient();

const getLastsScholarYearsQuery = async () => {
  const query = await prisma.scholarYears.findMany({
    take: 10,
    orderBy: { Name: "desc" },
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

export default getLastsScholarYearsQuery;
