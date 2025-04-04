import { PrismaClient } from "@prisma/client";
import { ScholarPeriodTableMap } from "../scholarPeriodsViewModel";

const prisma = new PrismaClient();

const getAllScholarPeriodsTableQuery = async () => {
  const query = await prisma.scholarPeriods.findMany({
    // orderBy: [{ IsActive: "desc" }, { Number: "desc" }, { Name: "desc" }],
    orderBy: [{ IsActive: "desc" }, { Number: "desc" }, { CreatedAt: "desc" }],
    include: {
      ScholarYears: true,
      StudentCourses: true,
    },
  });

  const res = query.map((scholarPeriod: ScholarPeriodTableMap) => ({
    ScholarPeriodId: scholarPeriod.ScholarPeriodId,
    Name: scholarPeriod.Name,
    Number: scholarPeriod.Number,
    FromDate: scholarPeriod.FromDate,
    ToDate: scholarPeriod.ToDate,
    IsActive: scholarPeriod.IsActive,
    ScholarYearId: scholarPeriod.ScholarYearId,
    ScholarYearName: scholarPeriod.ScholarYears.Name,
    IsDeletable: scholarPeriod.StudentCourses.length === 0,
  }));

  return res;
};

export default getAllScholarPeriodsTableQuery;
