import { EventRepositoryDatabase } from "./event-repository.js"

describe("Event Respository", () => {
  test("should create a event on db", async () => {
    const eventRepository = new EventRepositoryDatabase()
    const id = crypto.randomUUID()
    const output = await eventRepository.create({
      id,
      name: "Party sunset",
      ticketPriceInCents: 1000,
      latitude: -90,
      longitude: -180,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: crypto.randomUUID(),
    })
    expect(output.id).toBe(id)
  })
})
