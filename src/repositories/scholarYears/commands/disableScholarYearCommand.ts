"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DeleteScholarYearParams = {
  ScholarYearId: number;
};

const disableScholarYearCommand = async (params: DeleteScholarYearParams) => {
  if (params.ScholarYearId !== null) {
    const command = await prisma.scholarYears.update({
      where: { ScholarYearId: params.ScholarYearId },
      data: {
        IsActive: false,
      },
    });

    return command;
  } else throw Error("La année scolaire est manquante");
};

export default disableScholarYearCommand;
