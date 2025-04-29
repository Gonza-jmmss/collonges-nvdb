"use server";

import { PrismaClient } from "@prisma/client";
import { YearPeriodSchema } from "@/zodSchemas/yearPeriodSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type YearPeriodParams = z.infer<typeof YearPeriodSchema>;

const createYearPeriodCommand = async (params: YearPeriodParams) => {
  const command = await prisma.yearPeriods.create({
    data: {
      Name: params.Name,
      PeriodType: params.PeriodType || 0,
      ScholarYearId: params.ScholarYearId || 0,
      IsEnabled: params.IsEnabled,
    },
  });

  return command;
};

export default createYearPeriodCommand;
