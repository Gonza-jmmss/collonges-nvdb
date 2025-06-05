import { PrismaClient } from "@prisma/client";
import { StudentsMap } from "../studentsViewModel";

const prisma = new PrismaClient();

type getAllStudentsQueryParamsType = {
  IsEnabled: boolean;
  YearPeriodId?: number;
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
    where: {
      IsEnabled: params.IsEnabled,
      ...(params.YearPeriodId !== 0 && { YearPeriodId: params.YearPeriodId }),
    },
    include: {
      Persons: {
        select: {
          PersonId: true,
          AlternativeName: true,
          FirstName: true,
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
      Users: true,
    },
  });

  const res = query.map((student: StudentsMap) => ({
    ...student,
    StudentName: student.Persons?.AlternativeName,
    StudentType: student.StudentTypes?.Name,
    DBaseCode: student.Persons?.DBaseCode,
    YearPeriodId: student.YearPeriodId,
    YearPeriodName: student.YearPeriods.Name,
    HasUser: student.Users.length > 0,
    FirstCredentials: {
      UserName: (student.Users[0] && student.Users[0].UserName) || null,
      StudentId: student.StudentId,
      UserFirstName: student.Persons?.FirstName,
    },
  }));

  return res;
};

export default getAllStudentsQuery;
