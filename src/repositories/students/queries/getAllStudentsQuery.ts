import { PrismaClient } from "@prisma/client";
import { StudentsMapViewModel } from "../studentsViewModel";

const prisma = new PrismaClient();

type getAllStudentsQueryParamsType = {
  IsEnabled: boolean;
};

const getAllStudentsQuery = async (params: getAllStudentsQueryParamsType) => {
  const query = await prisma.students.findMany({
    orderBy: [
      {
        IsACA: "desc",
      },
      {
        Persons: {
          LastName: "asc",
        },
      },
    ],
    where: { IsEnabled: params.IsEnabled },
    include: {
      Persons: {
        select: {
          AlternativeName: true,
          DBaseCode: true,
        },
      },
      StudentTypes: {
        select: {
          Name: true,
        },
      },
    },
  });

  const res = query.map((student: StudentsMapViewModel) => ({
    ...student,
    StudentName: student.Persons?.AlternativeName,
    StudentType: student.StudentTypes?.Name,
    DBaseCode: student.Persons?.DBaseCode,
    // Persons: undefined,
    // StudentTypes: undefined,
  }));

  return res;
};

export default getAllStudentsQuery;
