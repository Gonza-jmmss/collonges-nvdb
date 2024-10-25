import { sql } from "drizzle-orm";
import { text, integer, sqliteTable } from "drizzle-orm/sqlite-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { z } from "zod";

export const usersTable = sqliteTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  status: text('status').default('active'),
  role: text('role').$type<Role>().notNull(),
  createdAt: integer('created_at').default(sql`(CURRENT_TIMESTAMP)`)
});

type Role = 'admin' | 'user' | 'guest';

// Schema for inserting a user - can be used to validate API requests
export const insertUserSchema = createInsertSchema(usersTable,{
  name: z.string().min(3,{message:'Name must be at least 3 characters long'}),
  status: z.string().refine((status) => ['active','inactive'].includes(status),{message:'Status must be one of active or inactive'}),
  role: z.string().refine((role) => ['admin','user','guest'].includes(role),{message:'Role must be one of admin, user or guest'})
});
// Schema for selecting a user - can be used to validate API responses
const selectUserSchema = createSelectSchema(usersTable);

export type User = z.infer<typeof selectUserSchema>;