"use server";

import { PrismaClient } from "@prisma/client";
import { YearPeriodSchema } from "@/zodSchemas/yearPeriodSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type YearPeriodParams = z.infer<typeof YearPeriodSchema>;

const updateYearPeriodCommand = async (params: YearPeriodParams) => {
  if (params.YearPeriodId !== null) {
    const command = await prisma.yearPeriods.update({
      where: { YearPeriodId: params.YearPeriodId },
      data: {
        Name: params.Name,
        PeriodType: params.PeriodType || 0,
        ScholarYearId: params.ScholarYearId || 0,
        IsEnabled: params.IsEnabled,
      },
    });

    return command;
  } else throw Error("La période d'année est manquante");
};

export default updateYearPeriodCommand;
