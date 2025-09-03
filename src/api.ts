import { EventRepositoryDatabase } from "./infra/repository/event-repository.js"
import { CreateEvent } from "./application/create-event.js"
import { db } from "./infra/db/client.js"
import fastify from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod"
import z from "zod"

const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

app.withTypeProvider<ZodTypeProvider>().route({
  method: "POST",
  url: "/events",
  schema: {
    body: z.object({
      name: z.string(),
      ticketPriceInCents: z.number(),
      latitude: z.number(),
      longitude: z.number(),
      date: z.iso.datetime(),
      ownerId: z.uuid(),
    }),
    response: {
      201: z.object({
        id: z.uuid(),
        name: z.string(),
        ticketPriceInCents: z.number(),
        latitude: z.number(),
        longitude: z.number(),
        date: z.iso.datetime(),
        ownerId: z.uuid(),
      }),
      400: z.object({
        message: z.string(),
      }),
    },
  },
  handler: async (req, res) => {
    const { name, ticketPriceInCents, latitude, longitude, date, ownerId } =
      req.body
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
      return res.status(201).send({
        ...event,
        date: event.date.toISOString(),
      })
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error)
      return res.status(400).send({ message: error.message })
    }
  },
})

app.listen({ port: 3000 }, () => {
  console.log("Server is running on port 3000")
})
