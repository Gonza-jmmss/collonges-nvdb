import { PrismaClient } from "@prisma/client";
import { StudentCourseGradesByStudentCourseIdMap } from "../studentCourseGradesViewModel";

const prisma = new PrismaClient();

type getStuedntCoursesGradesByStudentCourseIdsQueryParamsType = {
  StudentCourseId: number[];
};

const getStuedntCoursesGradesByStudentCourseIdsQuery = async (
  params: getStuedntCoursesGradesByStudentCourseIdsQueryParamsType,
) => {
  const query = await prisma.studentCourseGrades.findMany({
    where: {
      StudentCourseId: { in: params.StudentCourseId },
    },
  });

  const res = query.map(
    (studentCourseGrade: StudentCourseGradesByStudentCourseIdMap) =>
      studentCourseGrade.StudenCourseGradeId,
  );

  return res;
};

export default getStuedntCoursesGradesByStudentCourseIdsQuery;
