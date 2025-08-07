import { PrismaClient } from "@prisma/client";
import { StudentsByCourseIdMap } from "../studentCoursesViewModel";
import getActiveScholarYearQuery from "@/repositories/scholarYears/queries/getActiveScholarYearQuery";
import { YearPeriodsEnum } from "@/enum/yearPerdios";
import { PeriodEnum } from "@/enum/periodEnum";

const prisma = new PrismaClient();

type getStudentsByCourseIdQueryParamsType = {
  CourseId: number;
  PeriodNumber: number;
};

const getStudentsByCourseIdQuery = async (
  params: getStudentsByCourseIdQueryParamsType,
) => {
  const activeScholarYear = await getActiveScholarYearQuery();

  const query = await prisma.studentCourses.findMany({
    orderBy: [{ Students: { Persons: { AlternativeName: "asc" } } }],
    where: {
      CourseId: params.CourseId,
      Students: {
        YearPeriods: {
          ScholarYearId: activeScholarYear.ScholarYearId,
          PeriodType:
            params.PeriodNumber === PeriodEnum["Cours d'été"]
              ? YearPeriodsEnum["Cours d'été"]
              : YearPeriodsEnum["Année scolaire"],
        },
      },
      // ScholarPeriods: {
      //   ScholarYearId: activeScholarYear.ScholarYearId,
      //   Number: params.PeriodNumber,
      // },
    },
    include: {
      Students: {
        include: {
          Persons: {
            select: {
              AlternativeName: true,
            },
          },
        },
      },
    },
  });

  const res = query.map((studentCourse: StudentsByCourseIdMap) => ({
    StudentCourseId: studentCourse.StudentCourseId,
    StudentId: studentCourse.StudentId,
    CourseId: studentCourse.CourseId,
    Note: studentCourse.Note,
    ScholarPeriodId: studentCourse.ScholarPeriodId,
    StudentName: studentCourse.Students.Persons.AlternativeName,
    AttendanceScore: studentCourse.AttendanceScore,
  }));

  return res;
};

export default getStudentsByCourseIdQuery;
