import { useEffect, useMemo, useState } from 'react'
import {
  GIFT_ORDER_QUANTITY_MAX,
  GIFT_SHOP_PRODUCT_BY_ID,
} from '#/features/gift-shop/constants/gift-shop.constants.ts'
import type { GiftProduct, GiftShopCartEntry } from '#/features/gift-shop/types/gift-shop.types.ts'

const CART_STORAGE_KEY = 'gift-shop-cart'

export interface GiftCartLine extends GiftShopCartEntry {
  product: GiftProduct
  lineTotal: number
}

export interface GiftShopCart {
  entries: GiftShopCartEntry[]
  lines: GiftCartLine[]
  total: number
  totalQuantity: number
  addItem: (productId: string, quantity?: number) => void
  setQuantity: (productId: string, quantity: number) => void
  removeItem: (productId: string) => void
  clearCart: () => void
}

export function useGiftShopCart(): GiftShopCart {
  const [entries, setEntries] = useState<GiftShopCartEntry[]>([])

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY)
      if (!raw) return
      // oxlint-disable-next-line react/set-state-in-effect
      setEntries(sanitizeEntries(JSON.parse(raw)))
    } catch {
      // ignore corrupt storage
    }
  }, [])

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(entries))
  }, [entries])

  const lines = useMemo(() => enrichEntries(entries), [entries])
  const total = useMemo(() => lines.reduce((sum, line) => sum + line.lineTotal, 0), [lines])
  const totalQuantity = useMemo(() => lines.reduce((sum, line) => sum + line.quantity, 0), [lines])

  const addItem = (productId: string, quantity = 1) => {
    if (!GIFT_SHOP_PRODUCT_BY_ID.has(productId)) return
    setEntries((previous) => {
      const existing = previous.find((entry) => entry.productId === productId)
      if (existing) {
        return previous.map((entry) =>
          entry.productId === productId
            ? { ...entry, quantity: clampQuantity(entry.quantity + quantity) }
            : entry
        )
      }
      return [...previous, { productId, quantity: clampQuantity(quantity) }]
    })
  }

  const setQuantity = (productId: string, quantity: number) => {
    setEntries((previous) =>
      previous
        .map((entry) =>
          entry.productId === productId ? { ...entry, quantity: clampQuantity(quantity) } : entry
        )
        .filter((entry) => entry.quantity > 0)
    )
  }

  const removeItem = (productId: string) => {
    setEntries((previous) => previous.filter((entry) => entry.productId !== productId))
  }

  const clearCart = () => setEntries([])

  return { entries, lines, total, totalQuantity, addItem, setQuantity, removeItem, clearCart }
}

function clampQuantity(quantity: number): number {
  return Math.max(0, Math.min(quantity, GIFT_ORDER_QUANTITY_MAX))
}

function sanitizeEntries(stored: unknown): GiftShopCartEntry[] {
  if (!Array.isArray(stored)) return []
  return stored.flatMap((entry) => {
    if (typeof entry !== 'object' || entry === null) return []
    const { productId, quantity } = entry as GiftShopCartEntry
    if (!GIFT_SHOP_PRODUCT_BY_ID.has(productId)) return []
    if (typeof quantity !== 'number' || !Number.isFinite(quantity)) return []
    return [{ productId, quantity: clampQuantity(Math.trunc(quantity)) }]
  })
}

function enrichEntries(entries: GiftShopCartEntry[]): GiftCartLine[] {
  return entries.flatMap((entry) => {
    const product = GIFT_SHOP_PRODUCT_BY_ID.get(entry.productId)
    if (!product) return []
    return [{ ...entry, product, lineTotal: product.price * entry.quantity }]
  })
}
