import { z } from "zod";

export const PersonSchema = z.object({
  PersonId: z.number().nullable(),
  FirstName: z.string().nullable(),
  LastName: z.string().nullable(),
  BirthDate: z.date().nullable(),
  Sex: z.number().nullable(),
  Telephone: z.string().nullable(),
  WorkTelephone: z.string().nullable(),
  BirthCity: z.string().nullable(),
  Address1: z.string().nullable(),
  BirthCountryId: z.number().nullable(),
  Email: z.string().nullable(),
});
