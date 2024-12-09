import { PrismaClient } from "@prisma/client";
import { Query } from "@/interfaces/query";
import { StudentsViewModel, StudentsMapViewModel } from "../studentsViewModel";

const prisma = new PrismaClient();

export class getAllStudentsQuery implements Query<StudentsViewModel[]> {
  async execute(): Promise<StudentsViewModel[]> {
    const result = await prisma.students.findMany({
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

    return result.map((student: StudentsMapViewModel) => ({
      ...student,
      StudentName: student.Persons?.AlternativeName,
      StudentType: student.StudentTypes?.Name,
      DBaseCode: student.Persons?.DBaseCode,
      // Persons: undefined,
      // StudentTypes: undefined,
    }));
  }
}
