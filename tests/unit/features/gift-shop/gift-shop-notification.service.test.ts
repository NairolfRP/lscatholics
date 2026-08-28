import { describe, expect, it } from 'vitest'
import { buildGiftShopNotificationEmbeds } from '#/features/gift-shop/server/gift-shop-notification.service.ts'
import type {
  GiftOrderLine,
  GiftOrderNotificationData,
} from '#/features/gift-shop/types/gift-shop.types.ts'

const ITEM = (id: number, name: string): GiftOrderLine => ({
  productId: `product-${id}`,
  itemId: id,
  productName: name,
  price: 500,
  quantity: 1,
})

const NOTIFICATION = (items: GiftOrderLine[]): GiftOrderNotificationData => ({
  reference: 'GC-AB2CD3EF4J',
  title: 'mr',
  firstname: 'Edmund',
  lastname: 'Hennessy',
  phone: '777',
  address: '123 test',
  items,
  amount: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
})

describe('buildGiftShopNotificationEmbeds', () => {
  it('fits a small order in a single embed with markdown description', () => {
    const embeds = buildGiftShopNotificationEmbeds(
      NOTIFICATION([
        ITEM(2633, 'Statuette Saint François d’Assise'),
        ITEM(6300, 'Collier Croix Crucifix Classique (Argent sterling)'),
      ])
    )

    expect(embeds).toHaveLength(1)
    expect(embeds[0].description).toContain('**Référence** : GC-AB2CD3EF4J')
    expect(embeds[0].description).toContain('**Identité** : Monsieur Edmund Hennessy')
    expect(embeds[0].description).toContain('**Adresse** : 123 test')
    expect(embeds[0].description).toContain('**Téléphone** : 777')
    expect(embeds[0].description).toContain('**Articles** :')
    expect(embeds[0].description).toContain('**Montant** : $1 000')
  })

  it('splits a large order into multiple embeds within the description limit', () => {
    const embeds = buildGiftShopNotificationEmbeds(
      NOTIFICATION(Array.from({ length: 30 }, (_, index) => ITEM(index, 'x'.repeat(200))))
    )

    expect(embeds.length).toBeGreaterThan(1)
    for (const embed of embeds) {
      expect.soft(embed.description!.length).toBeLessThanOrEqual(4096)
    }
    expect(embeds[0].description).toContain('**Articles** :')
    expect(embeds[1].description).toContain('**Articles (suite)** :')
  })

  it('escapes Discord markdown in user-supplied fields', () => {
    const data: GiftOrderNotificationData = {
      reference: 'GC-AB2CD3EF4J',
      title: 'mr',
      firstname: 'a **bold** and *italic* name',
      lastname: 'M* Édouard',
      phone: '123',
      address: '@everyone <@123> ||spoil||',
      items: [ITEM(2633, 'Statuette Saint François d’Assise')],
      amount: 500,
    }

    const description = buildGiftShopNotificationEmbeds(data)[0].description!

    expect(description).not.toContain('<@123>')
    expect(description).toContain('\\<@123\\>')
    expect(description).not.toContain('**bold**')
    expect(description).toContain('\\*\\*bold\\*\\*')
    expect(description).not.toContain('||spoil||')
    expect(description).toContain('\\|\\|spoil\\|\\|')
    // `@everyone` cannot be escaped in markdown; allowed_mentions: { parse: [] }
    // on the webhook payload is what neutralizes it (see sendGiftShopNotification).
    expect(description).toContain('@everyone')
  })
})
