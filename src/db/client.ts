import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

if (!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required");
if (!process.env.DATABASE_TOKEN) throw new Error("DATABASE_TOKEN is required");

const client = createClient({
  url: process.env.DATABASE_URL,
  authToken: process.env.DATABASE_TOKEN,
});

export const db = drizzle(client);
