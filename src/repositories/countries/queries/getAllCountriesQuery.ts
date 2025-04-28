import { cache } from "react";
import { PrismaClient } from "@prisma/client";
import { CountriesViewModel } from "../countriesViewModel";

const prisma = new PrismaClient();

const getAllCountriesQuery = cache(async () => {
  const query = await prisma.countries.findMany({});

  const res = query.map((country: CountriesViewModel) => ({
    CountryId: country.CountryId,
    Name: country.Name,
    ISO2: country.ISO2,
    ISO3: country.ISO3,
    PhoneCode: country.PhoneCode,
    NameEnglish: country.NameEnglish,
  }));

  return res;
});

export default getAllCountriesQuery;
