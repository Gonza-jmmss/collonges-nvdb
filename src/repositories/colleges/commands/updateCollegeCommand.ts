"use server";

import { PrismaClient } from "@prisma/client";
import { CollegeSchema } from "@/zodSchemas/collegeSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type collegeParams = z.infer<typeof CollegeSchema>;

const updateCollegeCommand = async (params: collegeParams) => {
  if (params.CollegeId !== null) {
    const command = await prisma.colleges.update({
      where: { CollegeId: params.CollegeId },
      data: {
        Name: params.Name,
        Abbreviation: params.Abbreviation,
      },
    });

    return command;
  } else return null;
};

export default updateCollegeCommand;
