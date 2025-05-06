import { PrismaClient } from "@prisma/client";
import { PersonContactsByContactTypeIdMap } from "../personContactsViewModel";

const prisma = new PrismaClient();

type getAllPersonContactsByContactTypeIdQueryParamsType = {
  ContactTypeId: number;
};

const getAllPersonContactsByContactTypeIdQuery = async (
  params: getAllPersonContactsByContactTypeIdQueryParamsType,
) => {
  const query = await prisma.contacts.findMany({
    where: { ContactTypeId: params.ContactTypeId },
  });

  const res = query.map((contact: PersonContactsByContactTypeIdMap) => ({
    ContactId: contact.ContactId,
    PersonId: contact.PersonId,
    ContactTypeId: contact.ContactTypeId,
  }));

  return res;
};

export default getAllPersonContactsByContactTypeIdQuery;
