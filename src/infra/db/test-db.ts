import { PostgreSqlContainer } from "@testcontainers/postgresql"
import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "./schema.js"
import { execSync } from "node:child_process"
import path from "node:path"

export const startPostgresTestDb = async () => {
  const container = await new PostgreSqlContainer("postgres:17")
    .withDatabase("event_connect_test_db")
    .withUsername("test")
    .withPassword("user")
    .start()
  const db = drizzle(container.getConnectionUri(), {
    schema,
  })
  const schemaPath = path.join(import.meta.dirname, "./schema.ts")
  execSync(
    `npx drizzle-kit push --dialect=postgresql --schema ${schemaPath} --url ${container.getConnectionUri()}`
  )
  return { db, container }
}
