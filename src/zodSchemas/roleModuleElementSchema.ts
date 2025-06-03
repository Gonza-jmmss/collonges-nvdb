import { z } from "zod";

export const Modules = z.object({
  RoleModuleElementId: z.number().nullable(),
  ModuleId: z.number().nullable(),
});

export const ModuleElements = z.object({
  RoleModuleElementId: z.number().nullable(),
  ModuleElementId: z.number().nullable(),
  IsShortcut: z.boolean().nullable(),
});

export const RoleModuleElementSchema = z.object({
  RoleId: z.number(),
  Modules: z.array(Modules).nullable(),
  ModuleElements: z.array(ModuleElements).nullable(),
});
