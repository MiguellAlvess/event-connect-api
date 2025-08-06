import { EventRepositoryDatabase } from "../infra/repository/event-repository.js"
import { CreateEvent } from "./create-event.js"

describe("Create Event", () => {
  const createEvent = new CreateEvent(new EventRepositoryDatabase())

  test("should create a event successfully", async () => {
    const input = {
      name: "Party sunset",
      ticketPriceInCents: 1000,
      latitude: -90,
      longitude: -180,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: crypto.randomUUID(),
    }
    const output = await createEvent.execute(input)
    expect(output.id).toBeDefined()
    expect(output.name).toBe(input.name)
    expect(output.ticketPriceInCents).toBe(input.ticketPriceInCents)
    expect(output.ownerId).toBe(input.ownerId)
  })
})
