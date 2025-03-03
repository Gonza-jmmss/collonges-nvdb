"use server";

import { PrismaClient } from "@prisma/client";
import getAllScholarPeriodsByScholarYearIdQuery from "@/repositories/scholarPeriods/queries/getAllScholetPeroidsByScholarYearIdQuery";

const prisma = new PrismaClient();

type DeleteScholarYearParams = {
  ScholarYearId: number;
};

const deleteScholarYearCommand = async (params: DeleteScholarYearParams) => {
  const scholarPeriodsByYearId = await getAllScholarPeriodsByScholarYearIdQuery(
    params.ScholarYearId,
  );

  if (scholarPeriodsByYearId.length > 0) {
    throw Error(
      "impossible de supprimer la année car elle a des périodes scolaires attribués",
    );
  }

  return await prisma.scholarYears.delete({
    where: {
      ScholarYearId: params.ScholarYearId,
    },
  });
};

export default deleteScholarYearCommand;
