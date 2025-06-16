"use server";

import { PrismaClient } from "@prisma/client";
import { CollegeSchema } from "@/zodSchemas/collegeSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type CollegeParams = z.infer<typeof CollegeSchema>;

const createCollegeCommand = async (params: CollegeParams) => {
  const command = await prisma.colleges.create({
    data: {
      Name: params.Name,
      Abbreviation: params.Abbreviation,
    },
  });

  return command;
};

export default createCollegeCommand;
