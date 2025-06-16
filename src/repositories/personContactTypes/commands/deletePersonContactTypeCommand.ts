"use server";

import { PrismaClient } from "@prisma/client";
import getAllPersonContactsByContactTypeIdQuery from "@/repositories/personContacts/queries/getAllPersonContactsByContactTypeIdQuery";

const prisma = new PrismaClient();

type DeletePersonContactTyParams = {
  ContactTypeId: number;
};

const deletePersonContactTypeCommand = async (
  params: DeletePersonContactTyParams,
) => {
  const studentCoursesbyPeriodId =
    await getAllPersonContactsByContactTypeIdQuery({
      ContactTypeId: params.ContactTypeId,
    });

  if (studentCoursesbyPeriodId.length > 0) {
    throw Error(
      "impossible de supprimer le type de contact car elle a des contacts attribués",
    );
  }

  const deletePersonCountry = prisma.contactTypes.delete({
    where: {
      ContactTypeId: params.ContactTypeId,
    },
  });

  return deletePersonCountry;
};

export default deletePersonContactTypeCommand;
