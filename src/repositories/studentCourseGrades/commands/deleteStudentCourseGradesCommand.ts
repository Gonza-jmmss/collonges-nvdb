"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const deleteStudentCourseGradesCommand = async (
  studentCourseGradeIds: number[],
) => {
  // delete StudentCourseGrades
  const deleteStudentCourseGrades = prisma.studentCourseGrades.deleteMany({
    where: {
      StudenCourseGradeId: {
        in: studentCourseGradeIds,
      },
    },
  });

  return deleteStudentCourseGrades;
};

export default deleteStudentCourseGradesCommand;
