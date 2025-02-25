import { PrismaClient } from "@prisma/client";
import { StudentCourseGroupedByStudentMap } from "../studentCoursesViewModel";

const prisma = new PrismaClient();

const getStudentCoursesByStudentIdQuery = async (studentId: number) => {
  const query = await prisma.students.findFirstOrThrow({
    where: { StudentId: studentId },
    include: {
      Persons: {
        select: {
          AlternativeName: true,
        },
      },
      StudentCourses: {
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
