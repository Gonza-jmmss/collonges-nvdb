import { PrismaClient } from "@prisma/client";
import { StudentsMapViewModel } from "../studentsViewModel";

const prisma = new PrismaClient();

const getAllStudentsQuery = async () => {
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
