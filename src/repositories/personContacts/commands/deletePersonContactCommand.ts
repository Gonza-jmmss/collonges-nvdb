"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DeletePersonContactParams = {
  ContactId: number;
  PersonId: number;
  transactionClient?: any;
};

const deletePersonContactCommand = async (
  params: DeletePersonContactParams,
) => {
  // Use the transaction client if provided, otherwise use the default prisma client
  const client = params.transactionClient || prisma;

  return await client.contacts.delete({
    where: {
      ContactId_PersonId: {
        ContactId: params.ContactId,
        PersonId: params.PersonId,
      },
    },
  });
};

export default deletePersonContactCommand;
