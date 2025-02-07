import { cache } from "react";
import { PrismaClient } from "@prisma/client";
import { ContactTypesViewModel } from "../peronContactTypesViewModel";

const prisma = new PrismaClient();

const getAllContactTypesQuery = cache(async () => {
  const query = await prisma.contactTypes.findMany({});

  const res = query.map((contactType: ContactTypesViewModel) => ({
    ContactTypeId: contactType.ContactTypeId,
    Name: contactType.Name,
  }));

  return res;
});

export default getAllContactTypesQuery;
