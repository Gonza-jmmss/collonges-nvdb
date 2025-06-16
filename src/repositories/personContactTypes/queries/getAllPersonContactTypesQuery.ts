import { cache } from "react";
import { PrismaClient } from "@prisma/client";
import { ContactTypesViewModel } from "../peronContactTypesViewModel";

const prisma = new PrismaClient();

const getAllContactTypesQuery = cache(async () => {
  const query = await prisma.contactTypes.findMany({
    include: {
      Contacts: true,
    },
  });

  const res = query.map((contactType: ContactTypesViewModel) => ({
    ContactTypeId: contactType.ContactTypeId,
    Name: contactType.Name,
    IsDeletable: contactType.Contacts.length === 0,
  }));

  return res;
});

export default getAllContactTypesQuery;
