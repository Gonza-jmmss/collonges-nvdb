import { PrismaClient } from "@prisma/client";
import { StudentCoursesByScholarPeriodIdMap } from "../studentCoursesViewModel";

const prisma = new PrismaClient();

const getAllStudentCoursesByScholarPeriodIdQuery = async (
  scholarPeriodId: number,
) => {
  const query = await prisma.studentCourses.findMany({
    where: { ScholarPeriodId: scholarPeriodId },
  });

  const res = query.map(
    (studentCourse: StudentCoursesByScholarPeriodIdMap) => ({
      StudentCourseId: studentCourse.StudentCourseId,
      StudentId: studentCourse.StudentId,
      CourseId: studentCourse.CourseId,
      Note: studentCourse.Note,
      ScholarPeriodId: studentCourse.ScholarPeriodId,
    }),
  );

  return res;
};

export default getAllStudentCoursesByScholarPeriodIdQuery;
