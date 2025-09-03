import { EventRepositoryDatabase } from "./infra/repository/event-repository.js"
import { CreateEvent } from "./application/create-event.js"
import { db } from "./infra/db/client.js"
import fastify, { FastifyReply, FastifyRequest } from "fastify"

const app = fastify()

app.post("/events", async (req: FastifyRequest, res: FastifyReply) => {
  const { name, ticketPriceInCents, latitude, longitude, date, ownerId } =
    req.body as {
      name: string
      ticketPriceInCents: number
      latitude: number
      longitude: number
      date: string
      ownerId: string
    }
  try {
    const eventRepositoryDatabase = new EventRepositoryDatabase(db)
    const createEvent = new CreateEvent(eventRepositoryDatabase)
    const event = await createEvent.execute({
      date: new Date(date),
      name,
      ticketPriceInCents,
      latitude,
      longitude,
      ownerId,
    })
    return res.status(201).send(event)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error)
    return res.status(400).send({ message: error.message })
  }
})
app.listen({ port: 3000 }, () => {
  console.log("Server is running on port 3000")
})
