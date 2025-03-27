import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const getGradeCoefficientByIdQuery = async (gradeCoefficientId: number) => {
  const query = await prisma.gradeCoefficients.findFirstOrThrow({
    where: { GradeCoefficientId: gradeCoefficientId },
  });

  const res = {
    ...query,
    CoefficientNumber: Number(query.Coefficient) * 100,
  };

  return res;
};

export default getGradeCoefficientByIdQuery;
