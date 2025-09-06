import { db } from "../infra/db/client.js"
import { eventsTable } from "../infra/db/schema.js"
import { startPostgresTestDb } from "../infra/db/test-db.js"
import { EventRepositoryDatabase } from "../infra/repository/event-repository.js"
import { CreateEvent } from "./create-event.js"

import { StartedPostgreSqlContainer } from "@testcontainers/postgresql"
import { InvalidOwnerIdError } from "./errors/index.js"

describe("Create Event Use Case", () => {
  let database: typeof db
  let container: StartedPostgreSqlContainer
  beforeAll(async () => {
    const testDatabase = await startPostgresTestDb()
    database = testDatabase.db
    container = testDatabase.container
  })
  afterAll(async () => {
    await database.$client.end()
    await container.stop()
  })
  beforeEach(async () => {
    await database.delete(eventsTable).execute()
  })

  const makeSut = () => {
    const eventRepository = new EventRepositoryDatabase(database)
    const sut = new CreateEvent(eventRepository)
    return { sut, eventRepository }
  }

  test("should create a event successfully", async () => {
    const { sut } = makeSut()
    const input = {
      name: "Party sunset",
      ticketPriceInCents: 1000,
      latitude: -90,
      longitude: -180,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: crypto.randomUUID(),
    }
    const output = await sut.execute(input)
    expect(output.id).toBeDefined()
    expect(output.name).toBe(input.name)
    expect(output.ticketPriceInCents).toBe(input.ticketPriceInCents)
    expect(output.ownerId).toBe(input.ownerId)
  })
  test("should throw an error if the ownerId is invalid", async () => {
    const { sut } = makeSut()
    const input = {
      name: "Show",
      ticketPriceInCents: 1000,
      latitude: -90,
      longitude: -180,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: "invalid-uuid",
    }
    const output = sut.execute(input)
    await expect(output).rejects.toThrow(new InvalidOwnerIdError())
  })
  test("should throw an error if the ticket price is negative", async () => {
    const { sut } = makeSut()
    const input = {
      name: "Sunset show",
      ticketPriceInCents: -10,
      latitude: -90,
      longitude: -180,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: crypto.randomUUID(),
    }
    const output = sut.execute(input)
    await expect(output).rejects.toThrow(new Error("Invalid ticket price"))
  })
  test("should throw an error if the latitude is invalid", async () => {
    const { sut } = makeSut()
    const input = {
      name: "Mindset Event",
      ticketPriceInCents: 2000,
      latitude: -100,
      longitude: -180,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: crypto.randomUUID(),
    }
    const output = sut.execute(input)
    await expect(output).rejects.toThrow(new Error("Invalid latitude"))
  })
  test("should throw an error if the longitude is invalid", async () => {
    const { sut } = makeSut()
    const input = {
      name: "GameDay Event",
      ticketPriceInCents: 2000,
      latitude: -90,
      longitude: -200,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: crypto.randomUUID(),
    }
    const output = sut.execute(input)
    await expect(output).rejects.toThrow(new Error("Invalid longitude"))
  })
  test("should throw an error if the date is in the past", async () => {
    const { sut } = makeSut()
    const input = {
      name: "Feira de ciencias",
      ticketPriceInCents: 2000,
      latitude: -90,
      longitude: -180,
      date: new Date(new Date().setHours(new Date().getHours() - 2)),
      ownerId: crypto.randomUUID(),
    }
    const output = sut.execute(input)
    await expect(output).rejects.toThrow(
      new Error("Date must be in the future")
    )
  })
  test("should throw an error if an event already exists for the same date, latitude and longitude", async () => {
    const { sut } = makeSut()
    const date = new Date(new Date().setHours(new Date().getHours() + 2))
    const input = {
      name: "Feira de ciencias",
      ticketPriceInCents: 2000,
      latitude: -90,
      longitude: -180,
      date,
      ownerId: crypto.randomUUID(),
    }
    const output = await sut.execute(input)
    expect(output.name).toBe(input.name)
    expect(output.ticketPriceInCents).toBe(input.ticketPriceInCents)
    const output2 = sut.execute(input)
    expect(output2).rejects.toThrow(new Error("Event already exists"))
  })
  test("should call EventRepository create with correct values", async () => {
    const { sut, eventRepository } = makeSut()
    const spy = vi.spyOn(eventRepository, "create")
    const input = {
      name: "Feira de ciencias",
      ticketPriceInCents: 2000,
      latitude: -90,
      longitude: -180,
      date: new Date(new Date().setHours(new Date().getHours() + 1)),
      ownerId: crypto.randomUUID(),
    }
    await sut.execute(input)
    expect(spy).toHaveBeenCalledWith({
      id: expect.any(String),
      ...input,
    })
  })
})
