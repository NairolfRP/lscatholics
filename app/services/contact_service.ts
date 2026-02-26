import { DiscordWebhookService } from '#services/discord_webhook_service'
import env from '#start/env'
import logger from '@adonisjs/core/services/logger'
import { CONTACT_SUBJECTS } from '#shared/constants/contact_subjects'

export class ContactService {
  public readonly ERROR_MESSAGES = {
    MISSING_WEBHOOK: 'Un problème est survenu. Contactez un administrateur du site.',
    WEBHOOK_FAILED: "Une erreur est survenue lors de l'envoi. Réessayez plus tard.",
    SUCCESS:
      'Merci ! Votre demande de contact a été soumise avec succès. Nous vous recontacterons dans les meilleurs délais',
  } as const

  public async sendToDiscord(payload: any, webhookUrl: string) {
    const discordWebhook = await DiscordWebhookService.create({ url: webhookUrl })

    this.buildDiscordEmbeds(discordWebhook, payload)

    this.configureThreadOptions(discordWebhook, payload)

    const result = await discordWebhook.execute()

    if (result) {
      logger.info(
        {
          name: `${payload.firstname} ${payload.lastname}`,
          subject: payload.subject,
        },
        'Contact form submitted successfully'
      )
    }

    return result
  }

  private buildDiscordEmbeds(discordWebhook: any, payload: any): void {
    const subjectLabel = CONTACT_SUBJECTS.find((item) => item.id === payload.subject)?.label

    discordWebhook.addEmbed({
      title: 'Informations générales',
      fields: [
        {
          name: 'Prénom',
          value: String(payload.firstname || 'N/A'),
          inline: true,
        },
        {
          name: 'Nom de famille',
          value: String(payload.lastname || 'N/A'),
          inline: true,
        },
        {
          name: 'Téléphone',
          value: String(payload.phone || 'N/A'),
        },
        {
          name: 'Objet',
          value: String(subjectLabel || 'N/A'),
        },
      ],
    })

    discordWebhook.addEmbed({
      title: 'Message',
      description: String(payload.message || 'Aucun message'),
      timestamp: new Date().toISOString(),
    })
  }

  private configureThreadOptions(discordWebhook: any, payload: any): void {
    const threadName = `${payload.firstname || 'N/A'} ${payload.lastname || 'N/A'}`.trim()
    const threadTag = env.get('DISCORD_CONTACT_WEBHOOK_TAG_ID')

    discordWebhook.setOptions({
      thread: {
        name: threadName || 'Contact Form Submission',
        tags: threadTag ? [threadTag] : undefined,
      },
    })
  }
}
