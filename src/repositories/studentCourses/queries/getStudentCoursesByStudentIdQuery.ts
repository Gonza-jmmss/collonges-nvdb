import { PrismaClient } from "@prisma/client";
import { StudentCourseGroupedByStudentMap } from "../studentCoursesViewModel";

const prisma = new PrismaClient();

type getStudentCoursesByStudentIdQueryParamsType = {
  StudentId: number;
  ScholarPeriodId: number;
};

const getStudentCoursesByStudentIdQuery = async (
  params: getStudentCoursesByStudentIdQueryParamsType,
) => {
  console.log("getStudentCoursesByStudentIdQuery params", params);
  const query = await prisma.students.findFirstOrThrow({
    orderBy: [{ IsEnabled: "desc" }, { Persons: { AlternativeName: "asc" } }],
    where: {
      StudentId: params.StudentId,
      // StudentCourses: {
      //   some: {
      //     ScholarPeriodId: params.ScholarPeriodId,
      //   },
      // },
    },
    include: {
      Persons: {
        select: {
          AlternativeName: true,
        },
      },
      StudentCourses: {
        where: {
          ScholarPeriodId: params.ScholarPeriodId,
        },
        include: {
          Courses: {
            select: {
              CourseId: true,
              Name: true,
              EnglishName: true,
              CourseCode: true,
            },
          },
          ScholarPeriods: {
            select: {
              Name: true,
            },
          },
        },
      },
    },
  });

  const res = {
    StudentId: query.StudentId,
    AlternativeName: query.Persons.AlternativeName,
    StudentCourses: query.StudentCourses.map(
      (studentCourse: StudentCourseGroupedByStudentMap) => ({
        StudentCourseId: studentCourse.StudentCourseId,
        Note: studentCourse.Note,
        ScholarPeriodId: studentCourse.ScholarPeriodId,
        ScholarPeriodName: studentCourse.ScholarPeriods.Name,
        CourseId: studentCourse.Courses.CourseId,
        Name: studentCourse.Courses.Name,
        CourseCode: studentCourse.Courses.CourseCode,
      }),
    ),
  };

  return res;
};

export default getStudentCoursesByStudentIdQuery;
