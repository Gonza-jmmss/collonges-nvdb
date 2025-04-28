"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DisableGradeCoefficientParams = {
  GradeCoefficientId: number;
};

const disableGradeCoefficientCommand = async (
  params: DisableGradeCoefficientParams,
) => {
  return await prisma.gradeCoefficients.update({
    where: {
      GradeCoefficientId: params.GradeCoefficientId,
    },
    data: {
      IsEnabled: false,
    },
  });
};

export default disableGradeCoefficientCommand;
