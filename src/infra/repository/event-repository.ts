import "dotenv/config"
import { drizzle } from "drizzle-orm/node-postgres"
import * as schema from "../db/schema.js"
import { EventRepository } from "../../application/create-event.js"
import { OnSiteEvent } from "../../domain/on-site-event.js"

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined")
}

const db = drizzle(process.env.DATABASE_URL, { schema })

export class EventRepositoryDatabase implements EventRepository {
  async create(input: OnSiteEvent): Promise<OnSiteEvent> {
    const [output] = await db
      .insert(schema.eventsTable)
      .values({
        // @ts-expect-error - drizzle
        date: input.date,
        ownerId: input.ownerId,
        name: input.name,
        ticketPriceInCents: input.ticketPriceInCents,
        latitude: input.latitude,
        longitude: input.longitude,
      })
      .returning()

    return {
      id: output.id,
      ownerId: output.ownerId,
      name: output.name,
      ticketPriceInCents: output.ticketPriceInCents,
      date: output.date,
      latitude: Number(output.latitude),
      longitude: Number(output.longitude),
    }
  }
}
