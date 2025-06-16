"use server";

import { PrismaClient } from "@prisma/client";
import getStudentsByYearPeriodIdQuery from "@/repositories/students/queries/getStudentsByYearPeriodIdQuery";

const prisma = new PrismaClient();

type DeleteYearPeriodParams = {
  YearPeriodId: number;
};

const deleteYearPeriodCommand = async (params: DeleteYearPeriodParams) => {
  const scholarPeriodsByYearId = await getStudentsByYearPeriodIdQuery({
    YearPeriodId: params.YearPeriodId,
  });

  console.log("deleteYearPeriodCommand", deleteYearPeriodCommand);

  if (scholarPeriodsByYearId.length > 0) {
    throw Error(
      "impossible de supprimer la période d'année car elle a des étudiants attribués",
    );
  }

  console.log("params", params);

  return await prisma.yearPeriods.delete({
    where: {
      YearPeriodId: params.YearPeriodId,
    },
  });
};

export default deleteYearPeriodCommand;
