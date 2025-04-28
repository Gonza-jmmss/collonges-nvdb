import { z } from "zod";

export const PersonContatcSchema = z.object({
  ContactId: z.number(),
  PersonId: z.number(),
  ContactTypeId: z.number(),
});
