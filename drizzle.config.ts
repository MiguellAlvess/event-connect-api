import "dotenv/config"
import { defineConfig } from "drizzle-kit"
import * as path from "path"

export default defineConfig({
  out: "./drizzle",
  schema: path.resolve(__dirname, "./src/infra/db/schema.ts"),
  dialect: "postgresql",
  dbCredentials: { url: process.env.DATABASE_URL! },
})
