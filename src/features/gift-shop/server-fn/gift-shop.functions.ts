import { createServerFn } from '@tanstack/react-start'
import * as giftShopOrderService from '#/features/gift-shop/server/gift-shop-order.service.ts'
import { looseObjectSchema } from '#shared/schemas/utils.schema.ts'

export const createGiftOrderFn = createServerFn({ method: 'POST' })
  .validator(looseObjectSchema)
  .handler(({ data }) => giftShopOrderService.createGiftOrder(data))
