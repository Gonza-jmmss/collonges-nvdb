"use server";

import { PrismaClient } from "@prisma/client";
import { ScholarYearSchema } from "@/zodSchemas/scholarYearSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type ScholarYearParams = z.infer<typeof ScholarYearSchema>;

const updateScholarYearCommand = async (params: ScholarYearParams) => {
  if (params.ScholarYearId !== null) {
    const command = await prisma.scholarYears.update({
      where: { ScholarYearId: params.ScholarYearId },
      data: {
        Name: params.Name,
        FromDate: params.FromDate,
        ToDate: params.ToDate,
        IsActive: params.IsActive,
      },
    });

    return command;
  } else throw Error("La année scolaire est manquante");
};

export default updateScholarYearCommand;
