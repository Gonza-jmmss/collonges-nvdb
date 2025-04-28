"use server";

import { PrismaClient } from "@prisma/client";
import getStudentCourseGradesByStudentCourseIdQuery from "@/repositories/studentCourseGrades/queries/getStudentCourseGradesByStudentCourseIdQuery";

const prisma = new PrismaClient();

type UpdateGradeOfSudentCourseCommandParams = {
  StudentCourseId: number;
  transactionClient?: any;
};

const updateGradeOfSudentCourseCommand = async (
  params: UpdateGradeOfSudentCourseCommandParams,
) => {
  // Use the transaction client if provided, otherwise use the default prisma client
  const client = params.transactionClient || prisma;

  // get the notes oranized by coefficient
  const studentCourseGrades =
    await getStudentCourseGradesByStudentCourseIdQuery({
      StudentCourseId: params.StudentCourseId,
      transactionClient: client,
    });

  // calculate weightedAverage
  const weightedAverage = calculateWeightedAverage(studentCourseGrades);

  // update Note value in studentCourses
  const updateGradeOfSudentCourse = await client.studentCourses.update({
    where: {
      StudentCourseId: params.StudentCourseId,
    },
    data: {
      Note: weightedAverage.toFixed(2),
    },
  });

  return updateGradeOfSudentCourse;
};

export default updateGradeOfSudentCourseCommand;

type gradeCoefficientsType = {
  Coefficient: number;
  CoefficientName: string;
  StudentCourseGrades: {
    StudentCourseId: number;
    Grade: number;
  }[];
}[];

type coefficientItemType = {
  Coefficient: number;
  CoefficientName: string;
  StudentCourseGrades: {
    StudentCourseId: number;
    Grade: number;
  }[];
};

const calculateWeightedAverage = (
  studentCourseGrades: gradeCoefficientsType,
) => {
  // Average calculation using array methods
  const coefficientsArray = studentCourseGrades.map(
    (coeficiente: coefficientItemType) => {
      // Filter out NaN grades
      const validGrades = coeficiente.StudentCourseGrades.filter(
        (grade) => !isNaN(grade.Grade),
      );

      // Calculate average grade for this coefficient using only valid grades
      const gradeSum = validGrades.reduce(
        (sum, grade) => sum + Number(grade.Grade),
        0,
      );

      return {
        average: validGrades.length > 0 ? gradeSum / validGrades.length : 0,
        coefficient: coeficiente.Coefficient,
      };
    },
  );

  // Filter out any coefficient items that might have NaN as average
  const validCoefficients = coefficientsArray.filter(
    (item) => !isNaN(item.average) && item.average !== null,
  );

  // Calculate final weighted average using only valid coefficients
  const totalWeightedSum = validCoefficients.reduce(
    (sum, item) => sum + item.average * item.coefficient,
    0,
  );

  const totalWeight = validCoefficients.reduce(
    (sum, item) => sum + item.coefficient,
    0,
  );

  // Return weighted average, or 0 if there are no valid coefficients
  return totalWeight > 0 ? totalWeightedSum / totalWeight : 0;
};

//Average calculation
// let coefficientsArray: { average: number; coefficient: number }[] = [];
// studentCourseGrades.forEach((coeficiente) => {
//   let coefficientAverage = 0;
//   coeficiente.StudentCourseGrades.forEach((studentCourseGrade) => {
//     coefficientAverage = +coefficientAverage + +studentCourseGrade.Grade;
//   });
//   coefficientsArray.push({
//     average: coefficientAverage / coeficiente.StudentCourseGrades.length,
//     coefficient: coeficiente.Coefficient,
//   });
// });

// console.log("coefficientsArray", coefficientsArray);
// let average = 0;
// coefficientsArray.forEach((coefficient) => {
//   average = average + coefficient.average * coefficient.coefficient;
// });
