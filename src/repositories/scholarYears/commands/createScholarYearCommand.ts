"use server";

import { PrismaClient } from "@prisma/client";
import { ScholarYearSchema } from "@/zodSchemas/scholarYearSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type ScholarYearParams = z.infer<typeof ScholarYearSchema>;

const createScholarYearCommand = async (params: ScholarYearParams) => {
  const command = await prisma.scholarYears.create({
    data: {
      Name: params.Name,
      FromDate: params.FromDate,
      ToDate: params.ToDate,
      IsActive: params.IsActive,
    },
  });

  return command;
};

export default createScholarYearCommand;
