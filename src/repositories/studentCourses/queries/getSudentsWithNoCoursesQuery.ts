import { PrismaClient } from "@prisma/client";
import { StudentsWithNoCoursesMap } from "../studentCoursesViewModel";
import { YearPeriodsEnum } from "@/enum/yearPerdios";
import { PeriodEnum } from "@/enum/periodEnum";

const prisma = new PrismaClient();

type getStudentsWithNoCoursesQueryParamsType = {
  ScholarYearId: number;
  ScholarPeriodId: number;
  PeriodNumber: number | null | undefined;
};

const getStudentsWithNoCoursesQuery = async (
  params: getStudentsWithNoCoursesQueryParamsType,
) => {
  const query = await prisma.students.findMany({
    orderBy: [{ Persons: { AlternativeName: "asc" } }],
    where: {
      IsEnabled: true,
      StudentCourses: {
        none: {
          ScholarPeriodId: params.ScholarPeriodId,
        },
      },
      YearPeriods: {
        ScholarYearId: params.ScholarYearId,
        PeriodType:
          params.PeriodNumber === PeriodEnum["Cours d'été"]
            ? YearPeriodsEnum["Cours d'été"]
            : YearPeriodsEnum["Année scolaire"],
      },
    },
    include: {
      Persons: {
        select: {
          AlternativeName: true,
        },
      },
    },
  });

  const res = query.map((student: StudentsWithNoCoursesMap) => ({
    StudentId: student.StudentId,
    AlternativeName: student.Persons.AlternativeName,
  }));

  return res;
};

export default getStudentsWithNoCoursesQuery;
