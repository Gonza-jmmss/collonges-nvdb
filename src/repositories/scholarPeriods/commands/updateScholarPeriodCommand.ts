"use server";

import { PrismaClient } from "@prisma/client";
import { ScholarPeriodSchema } from "@/zodSchemas/scholarPeriodSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type ScholarPeriodParams = z.infer<typeof ScholarPeriodSchema>;

const updateScholarPeriodCommand = async (params: ScholarPeriodParams) => {
  if (params.ScholarPeriodId !== null) {
    const command = await prisma.scholarPeriods.update({
      where: { ScholarPeriodId: params.ScholarPeriodId },
      data: {
        Name: params.Name,
        Number: params.Number,
        FromDate: params.FromDate,
        ToDate: params.ToDate,
        IsActive: params.IsActive,
        ScholarYearId: params.ScholarYearId || 0,
      },
    });

    return command;
  } else throw Error("La période scolaire est manquante");
};

export default updateScholarPeriodCommand;
