"use server";

import { PrismaClient } from "@prisma/client";
import { GradeCoefficientSchema } from "@/zodSchemas/gradeCoefficientSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type GradeCoefficientParams = z.infer<typeof GradeCoefficientSchema>;

const updateGradeCoefficientCommand = async (
  params: GradeCoefficientParams,
) => {
  return await prisma.gradeCoefficients.update({
    where: {
      GradeCoefficientId: params.GradeCoefficientId || 0,
    },
    data: {
      Name: params.Name,
      Coefficient: params.Coefficient / 100,
      IsEnabled: params.IsEnabled,
    },
  });
};

export default updateGradeCoefficientCommand;
