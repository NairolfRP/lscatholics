import { createFileRoute } from '@tanstack/react-router'
import { GiftShopPage } from '#/features/gift-shop/components/gift-shop-page.tsx'
import { pageMetadata } from '#/utils/seo.ts'

export const Route = createFileRoute('/_app/gift-shop')({
  head: () => ({
    meta: pageMetadata('Boutique de la Cathédrale'),
  }),
  component: GiftShopPage,
})
