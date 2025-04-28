"use server";

import { PrismaClient } from "@prisma/client";
import getStudentByIdQuery from "@/repositories/students/queries/getStudentByIdQuery";

const prisma = new PrismaClient();

type deleteUserParamsType = {
  StudentId: number;
};

const disableStudentCommand = async (params: deleteUserParamsType) => {
  if (params.StudentId !== null) {
    const command = await prisma.students.update({
      where: { StudentId: params.StudentId },
      data: {
        IsEnabled: false,
      },
    });

    const student = getStudentByIdQuery(command.StudentId);

    return student;
  } else return null;
};

export default disableStudentCommand;
