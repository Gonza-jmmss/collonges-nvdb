"use server";

import { PrismaClient } from "@prisma/client";
import { PersonContatcSchema } from "@/zodSchemas/personContactSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type PersonContactParams = z.infer<typeof PersonContatcSchema>;

const createPersonContactCommand = async (params: PersonContactParams) => {
  const command = await prisma.contacts.create({
    data: {
      ContactId: params.ContactId,
      PersonId: params.PersonId,
      ContactTypeId: params.ContactTypeId,
    },
  });

  return command;
};

export default createPersonContactCommand;
