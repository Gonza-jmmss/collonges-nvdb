import { PrismaClient } from "@prisma/client";
import { StudentCoursesByStudentIdMap } from "../studentCoursesViewModel";

const prisma = new PrismaClient();

type getStudentCoursesByStudentIdQueryParams = {
  StudentId: number;
  ScholarPeriodId: number;
};

const getStudentCoursesByStudentIdQuery = async (
  params: getStudentCoursesByStudentIdQueryParams,
) => {
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
      (studentCourse: StudentCoursesByStudentIdMap) => ({
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
