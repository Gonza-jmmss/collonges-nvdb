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

  // get the notes organized by coefficient
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
  // Group grades by coefficient name to handle multiple coefficients with the same name
  const coefficientGroups = new Map<
    string,
    Array<{
      coefficient: number;
      grades: number[];
    }>
  >();

  // First, organize all grades by their coefficient name
  studentCourseGrades.forEach((coefficientItem: coefficientItemType) => {
    // Only include enabled coefficients (assuming IsEnabled is considered)
    const validGrades = coefficientItem.StudentCourseGrades.map((grade) =>
      Number(grade.Grade),
    ).filter((grade) => !isNaN(grade));

    // Only process this coefficient if there are valid grades for it
    if (validGrades.length > 0) {
      const groupName = coefficientItem.CoefficientName;

      if (!coefficientGroups.has(groupName)) {
        coefficientGroups.set(groupName, []);
      }

      coefficientGroups.get(groupName)!.push({
        coefficient: coefficientItem.Coefficient,
        grades: validGrades,
      });
    }
  });

  // Calculate weighted sum and total weight across all coefficient groups
  let totalWeightedSum = 0;
  let totalWeight = 0;

  for (const [groupName, coefficientItems] of coefficientGroups.entries()) {
    for (const item of coefficientItems) {
      // Calculate average grade for this specific coefficient
      const averageGrade =
        item.grades.reduce((sum, grade) => sum + grade, 0) / item.grades.length;

      // Add to weighted sum and total weight
      totalWeightedSum += averageGrade * item.coefficient;
      totalWeight += item.coefficient;
    }
  }

  // Return weighted average, or 0 if there are no valid grades
  return totalWeight > 0 ? totalWeightedSum / totalWeight : 0;
};
