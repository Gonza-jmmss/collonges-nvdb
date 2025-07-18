import { z } from "zod";

export const RoleSchema = z.object({
  RoleId: z.number(),
  Name: z.string(),
  IsEnabled: z.boolean(),
});
