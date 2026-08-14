import { setResponseStatus } from '@tanstack/react-start/server'
import { z } from 'zod'
import { env } from '#/config/env.server.ts'
import { bankTransferSchema } from '#/features/banking/schema/banking.schema.ts'
import { isDev } from '#/utils/environment.ts'
import { getFieldErrors } from '#/utils/form.ts'
import { formatCurrency } from '#/utils/number.ts'
import { logger } from '#server/integrations/logger.ts'
import type { DiscordEmbed } from '#server/services/discord.service.ts'
import { sendWebhookMessage } from '#server/services/discord.service.ts'
import { fleecaClient } from '#server/services/fleeca.service.ts'
import { FLEECA_OUTGOING_TRANSFERS_ERRORS } from '#shared/constants/fleeca.constants.ts'
import type { User } from '#shared/lib/types/auth.ts'
import type { CharacterWithFaction } from '#shared/types/character.types.ts'

export const BANKING_TRANSACTION_EMBED_COLOR = 0x249046

export async function getBankBalance() {
  return fleecaClient.getBalance()
}

export async function bankTransfer({
  data,
  user,
  currentCharacter,
}: {
  data: unknown
  user: User
  currentCharacter: CharacterWithFaction | null
}) {
  if (!isDev) {
    setResponseStatus(501)
    throw new Response(
      JSON.stringify({ error: 'NOT_IMPLEMENTED', message: 'Not implemented. Soon!' })
    )
  }

  try {
    const validatedData = await bankTransferSchema.parseAsync(data)

    const result = await fleecaClient.makeTransfer({
      routing: validatedData.iban,
      amount: validatedData.amount,
      description: validatedData.description,
    })

    if (result.data.status === 'failed') {
      if (result.data.description === FLEECA_OUTGOING_TRANSFERS_ERRORS.ROUTING_NOT_FOUND) {
        return {
          success: false,
          validationErrors: {
            iban: [
              { message: "Cet IBAN n'existe pas. Vérifiez que vous avez saisi les bons numéros." },
            ],
          },
        }
      }

      return { success: false, error: result.data.description }
    }

    void sendBankingTransactionLog({
      transferId: result.data.transferId,
      amount: validatedData.amount,
      description: validatedData.description,
      comment: validatedData.comment,
      recipientRouting: validatedData.iban,
      recipientName: result.data.recipientName,
      newBalance: result.newBalance,
      operatorName: buildOperatorName({ user, currentCharacter }),
    })

    return {
      success: true,
      data: {
        newBalance: result.newBalance,
        transferId: result.data.transferId,
        recipient: result.data.recipientName,
        amount: validatedData.amount,
      },
    }
  } catch (err) {
    if (err instanceof z.ZodError) {
      const validationErrors = getFieldErrors(err)
      setResponseStatus(400)
      return { success: false, validationErrors }
    }

    logger.error({ err, data, userId: user.id }, 'Failed to make a bank transfer')
    setResponseStatus(500)
    return { success: false, error: 'Une erreur est survenue' }
  }
}

interface BankingTransactionLog {
  transferId: number
  amount: number
  description: string
  comment?: string
  recipientRouting: string
  recipientName: string | null
  newBalance: number
  operatorName: string
}

async function sendBankingTransactionLog(log: BankingTransactionLog): Promise<void> {
  const webhookUrl = env.BANKING_TRANSACTION_LOGS_DISCORD_WEBHOOK
  if (!webhookUrl) {
    logger.error(
      { log },
      '[Banking] Failed to send transaction log. BANKING_TRANSACTION_LOGS_DISCORD_WEBHOOK is not configured'
    )
    return
  }

  try {
    await sendWebhookMessage({
      url: webhookUrl,
      payload: {
        embeds: [buildTransactionEmbed(log)],
      },
    })
  } catch (err) {
    logger.error({ err, log }, 'Failed to send banking transaction log')
  }
}

function buildTransactionEmbed(log: BankingTransactionLog): DiscordEmbed {
  const fields: DiscordEmbed['fields'] = [
    { name: 'Opérateur', value: log.operatorName, inline: true },
    { name: 'Destinataire', value: log.recipientName ?? log.recipientRouting, inline: true },
    { name: 'IBAN', value: log.recipientRouting },
    { name: 'Libellé', value: log.description },
  ]

  if (log.comment) {
    fields.push({ name: 'Commentaire (interne)', value: log.comment })
  }

  fields.push(
    { name: 'ID de transfert', value: `#${log.transferId}`, inline: true },
    { name: 'Nouveau solde', value: formatCurrency(log.newBalance), inline: true }
  )

  return {
    title: `Transaction sortante — ${formatCurrency(log.amount)}`,
    color: BANKING_TRANSACTION_EMBED_COLOR,
    fields,
    timestamp: new Date().toISOString(),
  }
}

function buildOperatorName({
  user,
  currentCharacter,
}: {
  user: User
  currentCharacter: CharacterWithFaction | null
}): string {
  if (currentCharacter) {
    return `${currentCharacter.firstname} ${currentCharacter.lastname}`
  }
  return user.name
}
