"use server";

import { PrismaClient } from "@prisma/client";
import { StudentSchema } from "@/zodSchemas/studentsSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type StudentParams = z.infer<typeof StudentSchema>;

const createStudentCommand = async (params: StudentParams) => {
  const command = await prisma.students.create({
    data: {
      PersonId: params.PersonId,
      StudentTypeId: params.StudentTypeId,
      IsACA: params.IsACA,
      DepartmentId: params?.DepartmentId,
      CollegeId: params.CollegeId,
      RegimeId: params.RegimeId,
      AccommodationId: params?.AccommodationId,
      IsEnabled: params.IsEnabled,
    },
  });

  return command;
};

export default createStudentCommand;
