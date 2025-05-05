import { z } from "zod";

export const PersonCountrySchema = z.object({
  PersonId: z.number(),
  CountryId: z.number(),
});
