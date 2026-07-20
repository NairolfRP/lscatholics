import type { PARISH } from '../constants/parish'

export type ParishId = (typeof PARISH)[keyof typeof PARISH]

export type ParishInfo = {
  id: ParishId
  title: string
  description?: string
  imageUrl?: string
  pastorOffice?: string
  pastor?: string
  address: string
  coords?: [number, number] | [number, number, number]
}
