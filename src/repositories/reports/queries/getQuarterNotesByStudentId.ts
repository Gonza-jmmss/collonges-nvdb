import { PrismaClient } from "@prisma/client";
import { Query } from "@/interfaces/query";

const prisma = new PrismaClient();

export class getQuarterNotesByStudentId implements Query<any[], number> {
  async execute(studentId: number): Promise<any[]> {
    const result = await prisma.students.findMany({
      where: {
        StudentId: studentId,
      },
    });

    return result.map((student) => ({
      ...student,
    }));
  }
}
