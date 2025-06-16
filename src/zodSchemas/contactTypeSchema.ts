import { z } from "zod";

export const ContactTypeSchema = z.object({
  ContactTypeId: z.number(),
  Name: z.string(),
});
