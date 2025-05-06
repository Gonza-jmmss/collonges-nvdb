"use server";

import { PrismaClient } from "@prisma/client";
import { ContactTypeSchema } from "@/zodSchemas/contactTypeSchema";
import { z } from "zod";

const prisma = new PrismaClient();

type ContactTypeParams = z.infer<typeof ContactTypeSchema>;

const createPersonContactTypeCommand = async (params: ContactTypeParams) => {
  const command = await prisma.contactTypes.create({
    data: {
      Name: params.Name,
    },
  });

  return command;
};

export default createPersonContactTypeCommand;
