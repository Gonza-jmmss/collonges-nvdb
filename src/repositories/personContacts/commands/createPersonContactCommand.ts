"use server";

import { PrismaClient } from "@prisma/client";
import { PersonContatcSchema } from "@/zodSchemas/personContactSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type PersonContactParams = z.infer<typeof PersonContatcSchema> & {
  transactionClient?: any;
};

const createPersonContactCommand = async (params: PersonContactParams) => {
  // Use the transaction client if provided, otherwise use the default prisma client
  const client = params.transactionClient || prisma;

  const command = await client.contacts.create({
    data: {
      ContactId: params.ContactId,
      PersonId: params.PersonId,
      ContactTypeId: params.ContactTypeId,
    },
  });

  return command;
};

export default createPersonContactCommand;
