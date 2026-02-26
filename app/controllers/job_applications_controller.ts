import type { HttpContext } from '@adonisjs/core/http'
import Job from '#models/job'
import { Exception } from '@adonisjs/core/exceptions'
import { DateTime } from 'luxon'
import { createEmploymentApplicationValidator } from '#validators/employment_application'
import { DiscordWebhookService } from '#services/discord_webhook_service'
import env from '#start/env'
import type { DiscordEmbedField } from '#types/discord/interfaces/entities/discord_embed'
import { getDistrictLabelById } from '#shared/constants/districts.constants'
import { getApplicationSourceLabel } from '#shared/constants/employment.constants'
import {
  getSchoolLevelLabelById,
  getSpokenLanguagesLabelById,
} from '#shared/constants/person.constants'
import JobTransformer from '#transformers/job_transformer'

export default class JobApplicationsController {
  private async getJob(slug: string) {
    return await Job.query()
      .select('id', 'slug', 'title')
      .where('slug', slug)
      .andWhere('is_active', true)
      .andWhere('expires_at', '>', DateTime.now().toSQL())
      .first()
  }

  async index({ params, inertia }: HttpContext) {
    const slug = params.slug as string

    const job = await this.getJob(slug)

    if (!job) {
      throw new Exception('Not found', { status: 404 })
    }

    const isExpired = !!(job.expiresAt && job.expiresAt >= DateTime.now())

    return inertia.render('jobs/application', {
      job: JobTransformer.transform(job).useVariant('employmentApplication'),
      isExpired,
    })
  }

  async submit({ params, logger, request, response, session, auth }: HttpContext) {
    const slug = params.slug as string

    const job = await this.getJob(slug)

    if (!job) {
      throw new Exception('Not found', { status: 404 })
    }

    const payload = await request.validateUsing(createEmploymentApplicationValidator)

    const jobTitle = job.title
    const characterFullName = `${payload.firstname} ${payload.middleName} ${payload.lastname}`
    const districtLabel = getDistrictLabelById(payload.district)
    const employmentSourceLabel = payload.applicationSource.type
      ? getApplicationSourceLabel(payload.applicationSource.type)
      : undefined
    const educationLevelLabel = getSchoolLevelLabelById(payload.education.highestLevel)

    try {
      const webhookUrl = env.get('DISCORD_EMPLOYMENT_APPLICATION_WEBHOOK')

      if (!webhookUrl) {
        throw new Error(
          'The environment variable DISCORD_EMPLOYMENT_APPLICATION_WEBHOOK is missing'
        )
      }

      const discordWebhook = await DiscordWebhookService.create({ url: webhookUrl })

      discordWebhook.setOptions({
        waitServerConfirmation: true,
        thread: {
          name: `[${jobTitle}] ${characterFullName}`,
        },
      })

      const discordEmbedFields: DiscordEmbedField[] = []

      discordEmbedFields.push({
        name: 'Prénom',
        value: payload.firstname,
        inline: true,
      })

      if (payload.middleName) {
        discordEmbedFields.push({
          name: 'Deuxième prénom',
          value: payload.middleName,
          inline: true,
        })
      }

      discordEmbedFields.push(
        {
          name: 'Nom de famille',
          value: payload.lastname,
          inline: true,
        },
        {
          name: 'Genre',
          value: payload.gender === 'female' ? ':female_sign:' : ':male_sign:',
        },
        {
          name: 'Âge',
          value: `${payload.age}`,
        },
        {
          name: 'Adresse',
          value: `${payload.address} (${districtLabel})`,
        },
        {
          name: 'Numéro de téléphone',
          value: `${payload.phone}`,
        },
        {
          name: 'Êtes-vous catholique pratiquant ?',
          value: payload.isPracticingCatholic ? ':ballot_box_with_check:' : ':x:',
        },
        {
          name: 'Si vous êtes embauché, pourrez-vous prouver votre droit à travailler aux États-Unis ?',
          value: payload.isLegalUSWorker ? ':ballot_box_with_check:' : ':x:',
        },
        {
          name: 'Possédez-vous un permis de conduire valide ?',
          value: payload.hasDriverLicense ? ':ballot_box_with_check:' : ':x:',
        }
      )

      if (employmentSourceLabel) {
        discordEmbedFields.push({
          name: "Comment avez-vous entendu parler de cette offre d'emploi ?",
          value: employmentSourceLabel,
        })

        if (
          payload.applicationSource.type === 'employeeReferral' &&
          payload.applicationSource.employeeReferral
        ) {
          discordEmbedFields.push({
            name: 'Employé référent',
            value: payload.applicationSource.employeeReferral,
          })
        }
      }

      discordWebhook.addEmbeds([
        {
          author: {
            name: 'LS Catholics',
            icon_url: 'https://i.imgur.com/0f4ZQS0.png',
          },
          title: `[${jobTitle}] Demande d'emploi de ${characterFullName}`,
          fields: discordEmbedFields,
        },
        {
          title: 'Éducation et compétences',
          fields: [
            {
              name: "Plus haut niveau d'éducation",
              value: educationLevelLabel,
            },
            {
              name: "Domaine d'études",
              value: payload.education.fieldOfStudy ? payload.education.fieldOfStudy : 'N/A',
            },
            {
              name: 'Langues étrangères maîtrisées',
              value: payload.spokenLanguages
                ? payload.spokenLanguages
                    .map((l) => `* ${getSpokenLanguagesLabelById(l)}`)
                    .join('\n')
                : 'N/A',
            },
          ],
        },
        {
          title: 'Expérience professionnelle',
          description:
            payload.professionalExperience && payload.professionalExperience?.length > 0
              ? payload.professionalExperience
                  .map((exp) => {
                    return `* **Compagnie** : ${exp.companyName}\n* **Poste / Fonction** : ${exp.position}\n${exp.isCurrentPosition ? `* **Depuis le** : ${exp.startDate}\n` : `* **De** : ${exp.startDate}\n* **À** : ${exp.endDate}\n* **Raison du départ** : ${exp.reasonForLeaving}\n`}`
                  })
                  .join(`\n`)
              : 'Aucune expérience professionnelle',
        },
      ])

      const discordResult = await discordWebhook.execute()

      if (!discordResult.success) {
        throw new Error(discordResult.error)
      }

      const threadId = discordResult.data?.channel_id

      if (!threadId) {
        throw new Error('Failed to get thread ID')
      }

      const sectionOOCDiscordWebhook = await DiscordWebhookService.create({ url: webhookUrl })

      sectionOOCDiscordWebhook.setOptions({
        thread: {
          id: threadId,
        },
      })

      sectionOOCDiscordWebhook.addEmbed({
        title: '(( SECTION OOC ))',
        description: `
          * **Pseudo Discord** : ${payload.discordUsername}
          ${payload.motivationsOOC ? `\n\n **Motivations et ambitions** :\n${payload.motivationsOOC}` : ''}
        `,
      })

      const sectionOOCDiscordResult = await sectionOOCDiscordWebhook.execute()

      if (!sectionOOCDiscordResult.success) {
        throw new Error(
          `Section OOC Discord Webhook failed with error: ${sectionOOCDiscordResult.error}`
        )
      }

      return response.redirect().toRoute('jobs.single', { slug })
    } catch (err) {
      logger.error(
        { err, userId: auth.user!.id, characterName: characterFullName },
        'Failed to send Employment Application discord webhook'
      )
      session.flashErrors({
        E_EMPLOYMENT_APPLICATION:
          'Une erreur est survenue lors de la soumission de votre candidature. Réessayez dans quelques instants ou contactez un administrateur du site.',
      })
      response.redirect().back()
    }
  }
}
