import { EventRepositoryDatabase } from "../infra/repository/event-repository.js"
import { CreateEvent } from "./create-event.js"

describe("Create Event Use Case", () => {
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
  test("should throw an error if the ownerId is invalid", async () => {
    const input = {
      name: "Show",
      ticketPriceInCents: 1000,
      latitude: -90,
      longitude: -180,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: "invalid-uuid",
    }
    const output = createEvent.execute(input)
    await expect(output).rejects.toThrow(new Error("Invalid ownerId"))
  })
  test("should throw an error if the ticket price is negative", async () => {
    const input = {
      name: "Sunset show",
      ticketPriceInCents: -10,
      latitude: -90,
      longitude: -180,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: crypto.randomUUID(),
    }
    const output = createEvent.execute(input)
    await expect(output).rejects.toThrow(new Error("Invalid ticket price"))
  })
  test("should throw an error if the latitude is invalid", async () => {
    const input = {
      name: "Mindset Event",
      ticketPriceInCents: 2000,
      latitude: -100,
      longitude: -180,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: crypto.randomUUID(),
    }
    const output = createEvent.execute(input)
    await expect(output).rejects.toThrow(new Error("Invalid latitude"))
  })
  test("should throw an error if the longitude is invalid", async () => {
    const input = {
      name: "GameDay Event",
      ticketPriceInCents: 2000,
      latitude: -90,
      longitude: -200,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: crypto.randomUUID(),
    }
    const output = createEvent.execute(input)
    await expect(output).rejects.toThrow(new Error("Invalid longitude"))
  })
})
