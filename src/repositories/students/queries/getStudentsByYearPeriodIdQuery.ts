import { PrismaClient } from "@prisma/client";
import { StudentsByYearPeriodIdMap } from "../studentsViewModel";

const prisma = new PrismaClient();

type getStudentsByYearPeriodIdParamsType = {
  YearPeriodId: number;
};

const getStudentsByYearPeriodId = async (
  params: getStudentsByYearPeriodIdParamsType,
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

  const res = query.map((student: StudentsByYearPeriodIdMap) => ({
    ...student,
    StudentName: student.Persons?.AlternativeName,
    StudentType: student.StudentTypes?.Name,
    DBaseCode: student.Persons?.DBaseCode,
    YearPeriodId: student.YearPeriods.YearPeriodId,
    YearPeriodName: student.YearPeriods.Name,
  }));

  return res;
};

export default getStudentsByYearPeriodId;
