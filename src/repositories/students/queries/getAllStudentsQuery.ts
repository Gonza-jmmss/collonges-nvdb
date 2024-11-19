import { PrismaClient } from "@prisma/client";
import { Query } from "@/interfaces/query";

const prisma = new PrismaClient();

export class getAllStudentsQuery implements Query<any[]> {
  async execute(): Promise<any[]> {
    const result = await prisma.students.findMany({
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

    return result.map((student) => ({
      ...student,
      StudentName: student.Persons?.AlternativeName,
      StudentType: student.StudentTypes?.Name,
      DBaseCode: student.Persons?.DBaseCode,
      Persons: undefined,
      StudentTypes: undefined,
    }));
  }
}
