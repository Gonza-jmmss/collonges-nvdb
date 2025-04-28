import { PrismaClient } from "@prisma/client";
import {
  StudentCourseGradesByStudentCourseIdMap,
  GradeCoefficientsByStudentCourseIdMap,
} from "../studentCourseGradesViewModel";

const prisma = new PrismaClient();

type getStudentCourseGradesByStudentCourseIdQueryParamsType = {
  StudentCourseId: number;
  transactionClient?: any;
};

const getStudentCourseGradesByStudentCourseIdQuery = async (
  params: getStudentCourseGradesByStudentCourseIdQueryParamsType,
) => {
  // Use the transaction client if provided, otherwise use the default prisma client
  const client = params.transactionClient || prisma;

  const query = await client.gradeCoefficients.findMany({
    where: {
      IsEnabled: true,
    },
    include: {
      StudentCourseGrades: {
        where: {
          StudentCourseId: params.StudentCourseId,
        },
      },
    },
  });

  const res = query.map(
    (gradeCoefficient: GradeCoefficientsByStudentCourseIdMap) => ({
      Coefficient: Number(gradeCoefficient.Coefficient),
      CoefficientName: gradeCoefficient.Name,
      StudentCourseGrades: gradeCoefficient.StudentCourseGrades.map(
        (studentCourseGrade: StudentCourseGradesByStudentCourseIdMap) => ({
          StudentCourseId: studentCourseGrade.StudentCourseId,
          Grade: Number(studentCourseGrade.Grade),
        }),
      ),
    }),
  );

  return res;
};

export default getStudentCourseGradesByStudentCourseIdQuery;
