"use server";

import { PrismaClient } from "@prisma/client";
import { StudentSchema } from "@/zodSchemas/studentsSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type StudentParams = z.infer<typeof StudentSchema> & {
  transactionClient?: any;
};

const updateStudentCommand = async (params: StudentParams) => {
  // Use the transaction client if provided, otherwise use the default prisma client
  const client = params.transactionClient || prisma;

  if (params.StudentId !== null) {
    const command = await client.students.update({
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
        YearPeriodId: params.YearPeriodId || 0,
      },
    });

    return command;
  } else return null;
};

export default updateStudentCommand;
