import { PrismaClient } from "@prisma/client";
import { StudentCourseGradesByCourseIdMap } from "../studentCourseGradesViewModel";

const prisma = new PrismaClient();

type getStudentCourseGradesByCourseIdQueryParamsType = {
  CourseId: number;
  Description: string;
  CreatedAt: Date;
};

const getStudentCourseGradesByCourseIdQuery = async (
  params: getStudentCourseGradesByCourseIdQueryParamsType,
) => {
  // Normalize `CreatedAt` by truncating milliseconds
  const createdAtStart = new Date(params.CreatedAt);
  createdAtStart.setMilliseconds(0); // Set milliseconds to 0

  const createdAtEnd = new Date(createdAtStart);
  createdAtEnd.setSeconds(createdAtEnd.getSeconds() + 1); // Next second to create a range

  const query = await prisma.studentCourseGrades.findMany({
    where: {
      StudentCourses: { CourseId: params.CourseId },
      Description: params.Description,
      CreatedAt: {
        gte: createdAtStart, // Start of the second
        lt: createdAtEnd, // Less than the next second
      },
    },
    include: {
      StudentCourses: {
        select: {
          StudentCourseId: true,
          Note: true,
        },
      },
    },
  });

  const res = {
    GradeCoefficientId: query[0].GradeCoefficientId,
    UserId: query[0].UserId,
    Description: query[0].Description,
    StudentCourses: query.map(
      (studentCourseGrade: StudentCourseGradesByCourseIdMap) => ({
        StudentCourseGradeId: studentCourseGrade.StudenCourseGradeId,
        StudentCourseId: studentCourseGrade.StudentCourses.StudentCourseId,
        Grade: studentCourseGrade.Grade,
        CreatedAt: studentCourseGrade.CreatedAt,
      }),
    ),
  };

  return res;
};

export default getStudentCourseGradesByCourseIdQuery;
