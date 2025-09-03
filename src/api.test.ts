import axios from "axios"

axios.defaults.validateStatus = () => true

describe("POST/events", () => {
  test("should create a event successfully", async () => {
    const input = {
      name: "Party sunset",
      ticketPriceInCents: 1000,
      latitude: -90.0,
      longitude: -180,
      date: new Date(
        new Date().setHours(new Date().getHours() + 1)
      ).toISOString(),
      ownerId: crypto.randomUUID(),
    }
    const response = await axios.post("http://localhost:3000/events", input)
    expect(response.status).toBe(201)
    expect(response.data.name).toBe(input.name)
    expect(response.data.ticketPriceInCents).toBe(input.ticketPriceInCents)
    // expect(response.data.latitude).toBe(input.latitude)
    // expect(response.data.longitude).toBe(input.longitude)
    expect(response.data.ownerId).toBe(input.ownerId)
  })
})
