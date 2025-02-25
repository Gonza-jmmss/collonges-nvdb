import { PrismaClient } from "@prisma/client";
import { StudentsWithNoCoursesMap } from "../studentCoursesViewModel";

const prisma = new PrismaClient();

const getStudentsWithNoCoursesQuery = async () => {
  const query = await prisma.students.findMany({
    where: { IsEnabled: true, StudentCourses: { none: {} } },
    include: {
      Persons: {
        select: {
          AlternativeName: true,
        },
      },
      StudentCourses: true,
    },
  });

  const res = query.map((student: StudentsWithNoCoursesMap) => ({
    StudentId: student.StudentId,
    AlternativeName: student.Persons.AlternativeName,
  }));

  return res;
};

export default getStudentsWithNoCoursesQuery;
