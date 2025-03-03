"use server";

import { PrismaClient } from "@prisma/client";
import { ScholarPeriodSchema } from "@/zodSchemas/scholarPeriodSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type ScholarPeriodParams = z.infer<typeof ScholarPeriodSchema>;

const createScholarPeriodCommand = async (params: ScholarPeriodParams) => {
  const command = await prisma.scholarPeriods.create({
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
};

export default createScholarPeriodCommand;
