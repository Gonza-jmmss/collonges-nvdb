"use server";

import { PrismaClient } from "@prisma/client";
import { ContactTypeSchema } from "@/zodSchemas/contactTypeSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type ContactTypeParams = z.infer<typeof ContactTypeSchema>;

const updatePersonContactTypeCommand = async (params: ContactTypeParams) => {
  if (params.ContactTypeId !== null) {
    const command = await prisma.contactTypes.update({
      where: { ContactTypeId: params.ContactTypeId },
      data: {
        Name: params.Name,
      },
    });

    return command;
  } else return null;
};

export default updatePersonContactTypeCommand;
