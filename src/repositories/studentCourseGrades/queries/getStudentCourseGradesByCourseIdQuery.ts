import { PrismaClient } from "@prisma/client";
import { StudentCourseGradesByCourseIdMap } from "../studentCourseGradesViewModel";

const prisma = new PrismaClient();

type getStudentCourseGradesByCourseIdQueryParamsType = {
  CourseId: number;
  Description: string;
  ActivityDate: Date;
};

const getStudentCourseGradesByCourseIdQuery = async (
  params: getStudentCourseGradesByCourseIdQueryParamsType,
) => {
  // Normalize `ActivityDate` by truncating milliseconds
  const activityDateStart = new Date(params.ActivityDate);
  activityDateStart.setMilliseconds(0); // Set milliseconds to 0

  const activityDateEnd = new Date(activityDateStart);
  activityDateEnd.setSeconds(activityDateEnd.getSeconds() + 1); // Next second to create a range

  const query = await prisma.studentCourseGrades.findMany({
    where: {
      StudentCourses: { CourseId: params.CourseId },
      Description: params.Description,
      ActivityDate: {
        gte: activityDateStart, // Start of the second
        lt: activityDateEnd, // Less than the next second
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

  if (query.length > 0) {
    const res = {
      GradeCoefficientId: query[0].GradeCoefficientId,
      UserId: query[0].UserId,
      Description: query[0].Description,
      ActivityDate: query[0].ActivityDate,
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
  } else {
    return null;
  }
};

export default getStudentCourseGradesByCourseIdQuery;
