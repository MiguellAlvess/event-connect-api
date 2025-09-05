import { EventRepositoryDatabase } from "../repository/event-repository.js"
import { CreateEvent } from "../../application/create-event.js"
import { db } from "../db/client.js"
import fastify from "fastify"
import type { ZodTypeProvider } from "fastify-type-provider-zod"
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod"
import z from "zod"
import fastifySwagger from "@fastify/swagger"
import fastifySwaggerUI from "@fastify/swagger-ui"
const app = fastify()

app.setValidatorCompiler(validatorCompiler)
app.setSerializerCompiler(serializerCompiler)

await app.register(fastifySwagger, {
  openapi: {
    info: {
      title: "Event Connect",
      description: "API for Event Connect",
      version: "1.0.0",
    },
    servers: [
      {
        description: "Local server",
        url: "http://localhost:8080",
      },
    ],
  },
  transform: jsonSchemaTransform,
})
await app.register(fastifySwaggerUI, {
  routePrefix: "/docs",
})

app.withTypeProvider<ZodTypeProvider>().route({
  method: "POST",
  url: "/events",
  schema: {
    tags: ["Events"],
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

await app.ready()
await app.listen({ port: 8080 }, () => {
  console.log("Server is running on port 8080")
})
