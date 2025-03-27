"use server";

import { cache } from "react";
import { PrismaClient } from "@prisma/client";
import { GradeCoefficientsMap } from "../gradeCoefficientsViewModel";

const prisma = new PrismaClient();

type getAllGradeCoefficientsQueryParamsType = {
  IsEnabled: boolean;
};

const getAllGradeCoefficientsQuery = cache(
  async (params: getAllGradeCoefficientsQueryParamsType) => {
    const query = await prisma.gradeCoefficients.findMany({
      where: {
        IsEnabled: params.IsEnabled,
      },
    });

    const res = query.map((gradeCoefficient: GradeCoefficientsMap) => ({
      GradeCoefficientId: gradeCoefficient.GradeCoefficientId,
      Name: gradeCoefficient.Name,
      CoefficientNumber: Number(gradeCoefficient.Coefficient) * 100,
      IsEnabled: gradeCoefficient.IsEnabled,
    }));

    return res;
  },
);

export default getAllGradeCoefficientsQuery;
