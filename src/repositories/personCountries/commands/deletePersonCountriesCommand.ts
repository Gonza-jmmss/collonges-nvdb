// "use server";

// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// type DeletePersonCountryParams = {
//   PersonId: number;
//   CountryId: number
// };

// const deletePersonCountryCommand = async (
//   params: DeletePersonCountryParams,
// ) => {
//   return await prisma.personCountries.delete({
//     where: {
//       PersonId: params.PersonId,
//       CountryId: params.CountryId,
//     },
//   });
// };

// export default deletePersonCountryCommand;

"use server";

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type DeletePersonCountriesParams = {
  personCountryIds: number[];
  transactionClient?: any;
};

const deletePersonCountriesCommand = async (
  params: DeletePersonCountriesParams,
) => {
  // Use the transaction client if provided, otherwise use the default prisma client
  const client = params.transactionClient || prisma;

  // delete PersonCountry
  const deletePersonCountry = client.personCountries.deleteMany({
    where: {
      PersonCountryId: {
        in: params.personCountryIds,
      },
    },
  });

  return deletePersonCountry;
};

export default deletePersonCountriesCommand;
