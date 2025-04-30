"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DisableYearPeriodParams = {
  YearPeriodId: number;
};

const disableYearPeriodCommand = async (params: DisableYearPeriodParams) => {
  if (params.YearPeriodId !== null) {
    const command = await prisma.yearPeriods.update({
      where: { YearPeriodId: params.YearPeriodId },
      data: {
        IsEnabled: false,
      },
    });

    return command;
  } else throw Error("La période d'année est manquante");
};

export default disableYearPeriodCommand;
