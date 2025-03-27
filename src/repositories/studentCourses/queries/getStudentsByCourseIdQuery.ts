import { PrismaClient } from "@prisma/client";
import { StudentsByCourseIdMap } from "../studentCoursesViewModel";

const prisma = new PrismaClient();

type getStudentsByCourseIdQueryParamsType = {
  CourseId: number;
};

const getStudentsByCourseIdQuery = async (
  params: getStudentsByCourseIdQueryParamsType,
) => {
  const query = await prisma.studentCourses.findMany({
    orderBy: [{ Students: { Persons: { AlternativeName: "asc" } } }],
    where: {
      CourseId: params.CourseId,
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
  }));

  return res;
};

export default getStudentsByCourseIdQuery;
