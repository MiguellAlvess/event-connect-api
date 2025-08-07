import { OnSiteEvent } from "../domain/on-site-event.js"

interface Input {
  ownerId: string
  name: string
  ticketPriceInCents: number
  latitude: number
  longitude: number
  date: Date
}

export interface EventRepository {
  create: (input: OnSiteEvent) => Promise<OnSiteEvent>
  getByDateLatAndLong: (params: {
    date: Date
    latitude: number
    longitude: number
  }) => Promise<OnSiteEvent | null>
}

export class CreateEvent {
  constructor(private eventRepository: EventRepository) {}

  async execute(input: Input) {
    const { ownerId, name, ticketPriceInCents, latitude, longitude, date } =
      input

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
        ownerId
      )
    ) {
      throw new Error("Invalid ownerId")
    }
    if (ticketPriceInCents < 0) {
      throw new Error("Invalid ticket price")
    }
    if (latitude < -90 || latitude > 90) {
      throw new Error("Invalid latitude")
    }
    if (longitude < -180 || longitude > 180) {
      throw new Error("Invalid longitude")
    }
    const now = new Date()
    if (date < now) {
      throw new Error("Date must be in the future")
    }
    const existentEvent = await this.eventRepository.getByDateLatAndLong({
      date,
      latitude,
      longitude,
    })
    if (existentEvent) {
      throw new Error("Event already exists")
    }
    const event = await this.eventRepository.create({
      id: crypto.randomUUID(),
      ownerId,
      name,
      ticketPriceInCents,
      latitude,
      longitude,
      date,
    })
    return event
  }
}
