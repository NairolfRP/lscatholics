import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { DONATION_EMBED_COLOR } from '#/features/donate/server/donation-notification.service.ts'
import type { DonationNotificationData } from '#/features/donate/types/donate.types.ts'

const postMock = vi.hoisted(() => vi.fn<(url: string, options?: unknown) => Promise<unknown>>())

vi.mock('ky', () => ({
  default: { post: postMock },
}))

const PRIVATE_WEBHOOK_URL = 'https://discord.com/api/webhooks/private'
const PUBLIC_WEBHOOK_URL = 'https://discord.com/api/webhooks/public'

const data: DonationNotificationData = {
  amount: 500,
  firstname: 'Jean',
  lastname: 'Valjean',
  age: 46,
  ethnicity: 'white',
  phone: '123456',
  address: '12 Ginger Street',
  district: 'little_seoul',
  isOrganization: false,
  organizationName: '',
  message: '',
  anonymous: false,
}

const mockDate = new Date('2026-08-05T14:09:05.100Z')

beforeEach(() => {
  vi.useFakeTimers()
  vi.setSystemTime(mockDate)
  vi.stubEnv('DONATE_PRIVATE_NOTIFICATION_WEBHOOK', PRIVATE_WEBHOOK_URL)
  vi.stubEnv('DONATE_PUBLIC_NOTIFICATION_WEBHOOK', PUBLIC_WEBHOOK_URL)
  vi.resetModules()
  postMock.mockReset()
})

afterEach(() => {
  vi.useRealTimers()
  vi.unstubAllEnvs()
})

describe('sendPrivateDonationNotification', () => {
  it('sends the private donation details to the private webhook', async () => {
    const { sendPrivateDonationNotification } =
      await import('#/features/donate/server/donation-notification.service.ts')

    await sendPrivateDonationNotification(data)

    expect(postMock).toHaveBeenCalledTimes(1)
    expect(postMock).toHaveBeenCalledWith(
      PRIVATE_WEBHOOK_URL,
      expect.objectContaining({
        json: {
          embeds: [
            {
              title: 'Don réalisé en ligne !',
              color: DONATION_EMBED_COLOR,
              timestamp: mockDate.toISOString(),
              fields: [
                { name: 'Identité', value: 'Jean Valjean' },
                { name: 'Âge', value: '46 ans' },
                { name: 'Ethnie', value: 'Blanc' },
                { name: 'Téléphone', value: '123456' },
                { name: 'Adresse', value: '12 Ginger Street (Little Seoul)' },
                { name: 'Montant du don', value: expect.stringMatching(/\$500/) },
                {
                  name: 'Le don peut-il être rendu public ?',
                  value: '✅ OUI',
                },
              ],
            },
          ],
          allowed_mentions: { parse: [] },
        },
      })
    )
  })

  it('includes the organization name for an organization donation', async () => {
    const { sendPrivateDonationNotification } =
      await import('#/features/donate/server/donation-notification.service.ts')

    await sendPrivateDonationNotification({
      ...data,
      isOrganization: true,
      organizationName: 'Los Santos Charity',
    })

    expect(postMock).toHaveBeenCalledWith(
      PRIVATE_WEBHOOK_URL,
      expect.objectContaining({
        json: expect.objectContaining({
          embeds: [
            expect.objectContaining({
              fields: expect.arrayContaining([
                {
                  name: "Au nom d'une société / organisation",
                  value: 'Los Santos Charity',
                },
              ]),
            }),
          ],
        }),
      })
    )
  })

  it('does nothing when the private webhook is not configured', async () => {
    vi.stubEnv('DONATE_PRIVATE_NOTIFICATION_WEBHOOK', '')
    vi.resetModules()
    const { sendPrivateDonationNotification } =
      await import('#/features/donate/server/donation-notification.service.ts')

    await sendPrivateDonationNotification(data)

    expect(postMock).not.toHaveBeenCalled()
  })

  it('does not throw when the webhook request fails', async () => {
    postMock.mockRejectedValue(new Error('boom'))
    const { sendPrivateDonationNotification } =
      await import('#/features/donate/server/donation-notification.service.ts')

    await expect(sendPrivateDonationNotification(data)).resolves.toBeUndefined()
  })
})

describe('sendPublicDonationNotification', () => {
  it('does nothing for an anonymous donation', async () => {
    const { sendPublicDonationNotification } =
      await import('#/features/donate/server/donation-notification.service.ts')

    await sendPublicDonationNotification({ ...data, anonymous: true })

    expect(postMock).not.toHaveBeenCalled()
  })

  it('sends a public announcement for a non-anonymous donation', async () => {
    const { sendPublicDonationNotification } =
      await import('#/features/donate/server/donation-notification.service.ts')

    await sendPublicDonationNotification(data)

    expect(postMock).toHaveBeenCalledTimes(1)
    expect(postMock).toHaveBeenCalledWith(
      PUBLIC_WEBHOOK_URL,
      expect.objectContaining({
        json: {
          username: 'LS Catholics',
          avatar_url: 'https://i.imgur.com/0f4ZQS0.png',
          embeds: [
            {
              title: "Un nouveau don en soutien à la mission de l'Église !",
              description: expect.stringContaining('**Jean Valjean**'),
              color: 0x057a66,
              image: { url: 'https://i.imgur.com/sZX0DD2.jpeg' },
              timestamp: mockDate.toISOString(),
            },
          ],
          allowed_mentions: { parse: [] },
        },
      })
    )
  })

  it('mentions the organization in the public announcement', async () => {
    const { sendPublicDonationNotification } =
      await import('#/features/donate/server/donation-notification.service.ts')

    await sendPublicDonationNotification({
      ...data,
      isOrganization: true,
      organizationName: 'Los Santos Charity',
    })

    expect(postMock).toHaveBeenCalledWith(
      PUBLIC_WEBHOOK_URL,
      expect.objectContaining({
        json: expect.objectContaining({
          embeds: [
            expect.objectContaining({
              description: expect.stringContaining(
                "l'organisation **Los Santos Charity**, et son représentant **Jean Valjean**"
              ),
            }),
          ],
        }),
      })
    )
  })

  it('uses the premium embed color for large donations', async () => {
    const { sendPublicDonationNotification } =
      await import('#/features/donate/server/donation-notification.service.ts')

    await sendPublicDonationNotification({ ...data, amount: 1_000_000 })

    expect(postMock).toHaveBeenCalledWith(
      PUBLIC_WEBHOOK_URL,
      expect.objectContaining({
        json: expect.objectContaining({
          embeds: [expect.objectContaining({ color: 0xfff100 })],
        }),
      })
    )
  })
})
