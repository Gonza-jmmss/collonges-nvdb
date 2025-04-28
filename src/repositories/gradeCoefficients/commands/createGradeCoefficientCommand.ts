"use server";

import { PrismaClient } from "@prisma/client";
import { GradeCoefficientSchema } from "@/zodSchemas/gradeCoefficientSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type GradeCoefficientParams = z.infer<typeof GradeCoefficientSchema>;

const createGradeCoefficientCommand = async (
  params: GradeCoefficientParams,
) => {
  const command = await prisma.gradeCoefficients.create({
    data: {
      Name: params.Name,
      Coefficient: params.Coefficient / 100,
      IsEnabled: params.IsEnabled,
    },
  });

  return command;
};

export default createGradeCoefficientCommand;
