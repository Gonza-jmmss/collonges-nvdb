import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type getPersonContactTypeByIdQueryParamsType = {
  ContactTypeId: number;
};

const getPersonContactTypeByIdQuery = async (
  params: getPersonContactTypeByIdQueryParamsType,
) => {
  const query = await prisma.contactTypes.findFirstOrThrow({
    where: { ContactTypeId: params.ContactTypeId },
  });

  const res = {
    ContactTypeId: query.ContactTypeId,
    Name: query.Name,
  };

  return res;
};

export default getPersonContactTypeByIdQuery;
