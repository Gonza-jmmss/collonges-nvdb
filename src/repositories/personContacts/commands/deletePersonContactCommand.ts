"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DeletePersonContactParams = {
  ContactId: number;
  PersonId: number;
};

const deletePersonContactCommand = async (
  params: DeletePersonContactParams,
) => {
  return await prisma.contacts.delete({
    where: {
      ContactId_PersonId: {
        ContactId: params.ContactId,
        PersonId: params.PersonId,
      },
    },
  });
};

export default deletePersonContactCommand;
