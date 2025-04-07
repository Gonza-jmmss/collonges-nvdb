import { PrismaClient } from "@prisma/client";
import { ScholarYearTableMap } from "../scholarYearsViewModel";

const prisma = new PrismaClient();

const getAllScholarYearsTableQuery = async () => {
  const query = await prisma.scholarYears.findMany({
    orderBy: { Name: "desc" },
    include: {
      ScholarPeriods: true,
    },
  });

  const res = query.map((scholarYear: ScholarYearTableMap) => ({
    ScholarYearId: scholarYear.ScholarYearId,
    Name: scholarYear.Name,
    FromDate: scholarYear.FromDate,
    ToDate: scholarYear.ToDate,
    IsActive: scholarYear.IsActive,
    IsDeletable: scholarYear.ScholarPeriods.length === 0,
  }));

  return res;
};

export default getAllScholarYearsTableQuery;
