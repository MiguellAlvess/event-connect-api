export interface OnSiteEvent {
  id: string
  ownerId: string
  name: string
  ticketPriceInCents: number
  date: Date
  latitude: number
  longitude: number
}
