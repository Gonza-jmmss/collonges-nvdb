"use server";

import { PrismaClient } from "@prisma/client";
import { StudentSchema } from "@/zodSchemas/studentsSchema";
import { z } from "zod";

import getStudentByIdQuery from "@/repositories/students/queries/getStudentByIdQuery";

const prisma = new PrismaClient();

type StudentParams = z.infer<typeof StudentSchema> & {
  transactionClient?: any;
};

const createStudentCommand = async (params: StudentParams) => {
  // Use the transaction client if provided, otherwise use the default prisma client
  const client = params.transactionClient || prisma;

  const command = await client.students.create({
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

  const student = getStudentByIdQuery(command.StudentId);

  return student;
};

export default createStudentCommand;
