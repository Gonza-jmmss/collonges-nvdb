"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DisableScholarPeriodParams = {
  ScholarPeriodId: number;
};

const disableScholarPeriodCommand = async (
  params: DisableScholarPeriodParams,
) => {
  if (params.ScholarPeriodId !== null) {
    const command = await prisma.scholarPeriods.update({
      where: { ScholarPeriodId: params.ScholarPeriodId },
      data: {
        IsActive: false,
      },
    });

    return command;
  } else throw Error("La période scolaire est manquante");
};

export default disableScholarPeriodCommand;
