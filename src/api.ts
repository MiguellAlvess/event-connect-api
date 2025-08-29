import express from "express"
import { EventRepositoryDatabase } from "./infra/repository/event-repository.js"
import { CreateEvent } from "./application/create-event.js"
import { db } from "./infra/db/client.js"

const app = express()

app.use(express.json())

app.post("/events", async (req, res) => {
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
    return res.status(201).json(event)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error)
    return res.status(400).json({ message: error.message })
  }
})

app.listen(3000, () => {
  console.log("Server is running on port 3000")
})
