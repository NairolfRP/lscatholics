import type { GiftOrderOutput } from '#/features/gift-shop/schemas/gift-shop.schema.ts'

export interface GiftCategory {
  id: string
  label: string
}

export interface GiftProduct {
  id: string
  categoryIds: readonly string[]
  itemId: number
  name: string
  description: string
  price: number
  imageSrc: string
}

export interface GiftShopCartEntry {
  productId: string
  quantity: number
}

export interface GiftOrderLine extends GiftShopCartEntry {
  itemId: number
  productName: string
  price: number
}

export type GiftOrderMetadata = Omit<GiftOrderOutput, 'fleecaConfirmation' | 'items'> & {
  reference: string
  items: GiftOrderLine[]
}

export interface GiftOrderNotificationData extends GiftOrderMetadata {
  amount: number
}
