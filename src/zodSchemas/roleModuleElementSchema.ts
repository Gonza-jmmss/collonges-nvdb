import { z } from "zod";

export const Modules = z.object({
  ModuleId: z.number().nullable(),
});

export const ModuleElements = z.object({
  ModuleElementId: z.number().nullable(),
});

export const RoleModuleElementSchema = z.object({
  RoleId: z.number(),
  Modules: z.array(Modules).nullable(),
  ModuleElements: z.array(ModuleElements).nullable(),
});
