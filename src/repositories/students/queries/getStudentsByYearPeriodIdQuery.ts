import { PrismaClient } from "@prisma/client";
import { StudentsMap } from "../studentsViewModel";

const prisma = new PrismaClient();

type getStudentsByYearPeriodIdQueryParams = {
  YearPeriodId: number;
};

const getStudentsByYearPeriodIdQuery = async (
  params: getStudentsByYearPeriodIdQueryParams,
) => {
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
    where: { YearPeriodId: params.YearPeriodId },
    include: {
      Persons: {
        select: {
          PersonId: true,
          FirstName: true,
          AlternativeName: true,
          DBaseCode: true,
        },
      },
      StudentTypes: {
        select: {
          StudentTypeId: true,
          Name: true,
        },
      },
      YearPeriods: {
        select: {
          YearPeriodId: true,
          Name: true,
        },
      },
    },
  });

  const res = query.map((student: StudentsMap) => ({
    ...student,
    StudentName: student.Persons?.AlternativeName,
    StudentType: student.StudentTypes?.Name,
    DBaseCode: student.Persons?.DBaseCode,
    YearPeriodId: student.YearPeriods.YearPeriodId,
    YearPeriodName: student.YearPeriods.Name,
  }));

  return res;
};

export default getStudentsByYearPeriodIdQuery;
