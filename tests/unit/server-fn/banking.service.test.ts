import { setResponseStatus } from '@tanstack/react-start/server'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  bankTransfer,
  BANKING_TRANSACTION_EMBED_COLOR,
  getBankBalance,
} from '#/features/banking/server/banking.service.ts'
import { formatCurrency } from '#/utils/number.ts'
import type { DiscordEmbed, DiscordWebhookPayload } from '#server/services/discord.service.ts'
import { FLEECA_OUTGOING_TRANSFERS_ERRORS } from '#shared/constants/fleeca.constants.ts'
import type { CharacterWithFaction } from '#shared/types/character.types.ts'
import { mockUser } from '../../utils/test-unit.utils.ts'

const mocks = vi.hoisted(() => ({
  isDev: true,
  getBalance: vi.fn(),
  makeTransfer: vi.fn(),
  sendWebhookMessage:
    vi.fn<(input: { url: string; payload: DiscordWebhookPayload }) => Promise<void>>(),
}))

vi.mock('#/utils/environment.ts', () => ({
  get isDev() {
    return mocks.isDev
  },
}))

vi.mock('#server/services/fleeca.service.ts', () => ({
  fleecaClient: {
    getBalance: mocks.getBalance,
    makeTransfer: mocks.makeTransfer,
  },
}))

vi.mock('#server/services/discord.service.ts', () => ({
  sendWebhookMessage: mocks.sendWebhookMessage,
}))

const WEBHOOK_URL = 'https://discord.com/api/webhooks/test'
const mockDate = new Date('2026-08-05T14:09:05.100Z')

const character: CharacterWithFaction = {
  id: 1,
  firstname: 'Jean',
  lastname: 'Valjean',
  bankRoutingNumber: '010012345',
  faction: null,
}

const validData = {
  iban: '010012345',
  amount: 1000,
  description: 'Achat de fournitures',
  comment: 'Bon de commande 42',
}

const transferResult = {
  newBalance: 99000,
  data: {
    transferId: 42,
    routing: '010012345',
    recipientName: 'Jean Valjean',
    payerName: 'LS Catholics',
    status: 'success',
    description: 'Achat de fournitures',
  },
}

function sentEmbed(): DiscordEmbed {
  const input = mocks.sendWebhookMessage.mock.calls[0][0]
  return input.payload.embeds![0]
}

beforeEach(() => {
  mocks.isDev = true
  mocks.getBalance.mockReset()
  mocks.makeTransfer.mockReset()
  mocks.sendWebhookMessage.mockReset()
})

afterEach(() => {
  vi.unstubAllEnvs()
})

describe('getBankBalance', () => {
  it('returns the balance from the Fleeca client', async () => {
    mocks.getBalance.mockResolvedValue(100000)

    await expect(getBankBalance()).resolves.toBe(100000)
    expect(mocks.getBalance).toHaveBeenCalledTimes(1)
  })

  it('propagates an error from the Fleeca client', async () => {
    mocks.getBalance.mockRejectedValue(new Error('boom'))

    await expect(getBankBalance()).rejects.toThrow('boom')
  })
})

describe('bankTransfer', () => {
  beforeEach(() => {
    vi.useFakeTimers()
    vi.setSystemTime(mockDate)
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('makes the transfer and logs it to the Discord webhook', async () => {
    mocks.makeTransfer.mockResolvedValue(transferResult)

    const result = await bankTransfer({
      data: validData,
      user: mockUser,
      currentCharacter: character,
    })

    expect(mocks.makeTransfer).toHaveBeenCalledWith({
      routing: '010012345',
      amount: 1000,
      description: 'Achat de fournitures',
    })
    expect(result).toEqual({
      success: true,
      data: {
        newBalance: 99000,
        transferId: 42,
        recipient: 'Jean Valjean',
        amount: 1000,
      },
    })
    expect(mocks.sendWebhookMessage).toHaveBeenCalledWith({
      url: WEBHOOK_URL,
      payload: {
        embeds: [
          {
            title: `Transaction sortante — ${formatCurrency(1000)}`,
            color: BANKING_TRANSACTION_EMBED_COLOR,
            timestamp: mockDate.toISOString(),
            fields: [
              { name: 'Opérateur', value: 'Jean Valjean', inline: true },
              { name: 'Destinataire', value: 'Jean Valjean', inline: true },
              { name: 'IBAN', value: '010012345' },
              { name: 'Libellé', value: 'Achat de fournitures' },
              { name: 'Commentaire (interne)', value: 'Bon de commande 42' },
              { name: 'ID de transfert', value: '#42', inline: true },
              { name: 'Nouveau solde', value: formatCurrency(99000), inline: true },
            ],
          },
        ],
      },
    })
  })

  it('omits the internal comment field when no comment is provided', async () => {
    mocks.makeTransfer.mockResolvedValue(transferResult)

    await bankTransfer({
      data: { ...validData, comment: undefined },
      user: mockUser,
      currentCharacter: character,
    })

    const fields = sentEmbed().fields ?? []
    expect(fields.some((field) => field.name === 'Commentaire (interne)')).toBe(false)
  })

  it('falls back to the user name when there is no character', async () => {
    mocks.makeTransfer.mockResolvedValue(transferResult)

    await bankTransfer({ data: validData, user: mockUser, currentCharacter: null })

    expect(sentEmbed().fields).toEqual(
      expect.arrayContaining([{ name: 'Opérateur', value: mockUser.name, inline: true }])
    )
  })

  it('returns an IBAN validation error when the destination routing is not found', async () => {
    mocks.makeTransfer.mockResolvedValue({
      ...transferResult,
      data: {
        ...transferResult.data,
        recipientName: null,
        status: 'failed',
        description: FLEECA_OUTGOING_TRANSFERS_ERRORS.ROUTING_NOT_FOUND,
      },
    })

    const result = await bankTransfer({
      data: validData,
      user: mockUser,
      currentCharacter: character,
    })

    expect(result).toEqual({
      success: false,
      validationErrors: {
        iban: [
          { message: "Cet IBAN n'existe pas. Vérifiez que vous avez saisi les bons numéros." },
        ],
      },
    })
    expect(mocks.sendWebhookMessage).not.toHaveBeenCalled()
  })

  it('returns the Fleeca failure reason for other transfer failures', async () => {
    mocks.makeTransfer.mockResolvedValue({
      ...transferResult,
      data: { ...transferResult.data, status: 'failed', description: 'Insufficient funds' },
    })

    const result = await bankTransfer({
      data: validData,
      user: mockUser,
      currentCharacter: character,
    })

    expect(result).toEqual({ success: false, error: 'Insufficient funds' })
    expect(mocks.sendWebhookMessage).not.toHaveBeenCalled()
  })

  it('returns field validation errors for invalid data', async () => {
    const result = await bankTransfer({
      data: { ...validData, amount: 100 },
      user: mockUser,
      currentCharacter: character,
    })

    expect(result.success).toBe(false)
    expect(result.validationErrors).toBeDefined()
    expect(setResponseStatus).toHaveBeenCalledWith(400)
    expect(mocks.makeTransfer).not.toHaveBeenCalled()
    expect(mocks.sendWebhookMessage).not.toHaveBeenCalled()
  })

  it('returns a generic error when the Fleeca client fails', async () => {
    mocks.makeTransfer.mockRejectedValue(new Error('boom'))

    const result = await bankTransfer({
      data: validData,
      user: mockUser,
      currentCharacter: character,
    })

    expect(result).toEqual({ success: false, error: 'Une erreur est survenue' })
    expect(setResponseStatus).toHaveBeenCalledWith(500)
    expect(mocks.sendWebhookMessage).not.toHaveBeenCalled()
  })

  it('still succeeds when the Discord webhook is not configured', async () => {
    vi.stubEnv('BANKING_TRANSACTION_LOGS_DISCORD_WEBHOOK', '')
    vi.resetModules()
    const freshService = await import('#/features/banking/server/banking.service.ts')
    mocks.makeTransfer.mockResolvedValue(transferResult)

    const result = await freshService.bankTransfer({
      data: validData,
      user: mockUser,
      currentCharacter: character,
    })

    expect(result.success).toBe(true)
    expect(mocks.sendWebhookMessage).not.toHaveBeenCalled()
  })

  it('is not implemented outside development', async () => {
    mocks.isDev = false

    await expect(
      bankTransfer({ data: validData, user: mockUser, currentCharacter: character })
    ).rejects.toBeInstanceOf(Response)
    expect(setResponseStatus).toHaveBeenCalledWith(501)
    expect(mocks.makeTransfer).not.toHaveBeenCalled()
  })
})
