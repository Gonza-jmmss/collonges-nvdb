import { defineConfig } from "drizzle-kit";

if(!process.env.DATABASE_URL) throw new Error("DATABASE_URL is required")
if(!process.env.DATABASE_TOKEN) throw new Error("DATABASE_TOKEN is required")


export default defineConfig({
    schema: "./src/db/schema/*",
    dialect: "sqlite",
    out: "./drizzle",
    driver:'turso',
    dbCredentials:{
        url: process.env.DATABASE_URL,
        authToken: process.env.DATABASE_TOKEN,
    }
});