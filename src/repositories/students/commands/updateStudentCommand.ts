"use server";

import { PrismaClient } from "@prisma/client";
import { StudentSchema } from "@/zodSchemas/studentsSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type StudentParams = z.infer<typeof StudentSchema>;

const updateStudentCommand = async (params: StudentParams) => {
  if (params.StudentId !== null) {
    const command = await prisma.students.update({
      where: { StudentId: params.StudentId },
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
  } else return null;
};

export default updateStudentCommand;
