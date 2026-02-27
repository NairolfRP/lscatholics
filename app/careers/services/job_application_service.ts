import type JobPosting from '#careers/models/job_posting'
import env from '#start/env'
import { DiscordWebhookService } from '#discord/services/discord_webhook_service'
import type { DiscordEmbedField } from '#discord/types/interfaces/entities/discord_embed'
import { getDistrictLabelById } from '#shared/constants/districts.constants'
import { getApplicationSourceLabel } from '#shared/constants/employment.constants'
import {
  getSchoolLevelLabelById,
  getSpokenLanguagesLabelById,
} from '#shared/constants/person.constants'
import type { EmploymentApplication } from '#careers/validators/employment_application'

type ApplicationPayload = EmploymentApplication

export class JobApplicationService {
  async sendToDiscord(job: JobPosting, payload: ApplicationPayload) {
    const webhookUrl = env.get('DISCORD_EMPLOYMENT_APPLICATION_WEBHOOK')

    if (!webhookUrl) {
      throw new Error('The environment variable DISCORD_EMPLOYMENT_APPLICATION_WEBHOOK is missing')
    }

    const characterFullName = `${payload.firstname}${payload.middleName ? ' ' + payload.middleName + ' ' : ' '}${payload.lastname}`
    const discordWebhook = await DiscordWebhookService.create({ url: webhookUrl })

    discordWebhook.setOptions({
      waitServerConfirmation: true,
      thread: {
        name: `[${job.title}] ${characterFullName}`,
      },
    })

    discordWebhook.addEmbeds([
      this.#buildMainInfoEmbed(job.title, characterFullName, payload),
      this.#buildEducationEmbed(payload),
      this.#buildExperienceEmbed(payload),
    ])

    const result = await discordWebhook.execute()

    if (!result.success) {
      throw new Error(`Discord Webhook failed: ${result.error}`)
    }

    const threadId = result.data?.channel_id
    if (!threadId) {
      throw new Error('Failed to retrieve Discord thread ID')
    }

    await this.#sendOOCSection(webhookUrl, threadId, payload)
  }

  #buildMainInfoEmbed(jobTitle: string, fullName: string, payload: ApplicationPayload) {
    const districtLabel = getDistrictLabelById(payload.district)
    const sourceLabel = payload.applicationSource.type
      ? getApplicationSourceLabel(payload.applicationSource.type)
      : undefined

    const fields: DiscordEmbedField[] = [{ name: 'Prénom', value: payload.firstname, inline: true }]

    if (payload.middleName) {
      fields.push({ name: 'Deuxième prénom', value: payload.middleName, inline: true })
    }

    fields.push(
      { name: 'Nom de famille', value: payload.lastname, inline: true },
      {
        name: 'Genre',
        value: payload.gender === 'female' ? ':female_sign:' : ':male_sign:',
        inline: true,
      },
      { name: 'Âge', value: `${payload.age}`, inline: true },
      { name: 'Adresse', value: `${payload.address} (${districtLabel})` },
      { name: 'Numéro de téléphone', value: `${payload.phone}`, inline: true },
      {
        name: 'Catholique pratiquant ?',
        value: payload.isPracticingCatholic ? ':ballot_box_with_check:' : ':x:',
        inline: true,
      },
      {
        name: 'Droit de travail US ?',
        value: payload.isLegalUSWorker ? ':ballot_box_with_check:' : ':x:',
        inline: true,
      },
      {
        name: 'Permis de conduire ?',
        value: payload.hasDriverLicense ? ':ballot_box_with_check:' : ':x:',
        inline: true,
      }
    )

    if (sourceLabel) {
      fields.push({
        name: "Source de l'offre",
        value: sourceLabel,
      })

      if (
        payload.applicationSource.type === 'employeeReferral' &&
        payload.applicationSource.employeeReferral
      ) {
        fields.push({
          name: 'Employé référent',
          value: payload.applicationSource.employeeReferral,
        })
      }
    }

    return {
      author: {
        name: 'LS Catholics',
        icon_url: 'https://i.imgur.com/0f4ZQS0.png',
      },
      title: `[${jobTitle}] Demande d'emploi de ${fullName}`,
      fields,
      color: 0x2b2d31,
    }
  }

  #buildEducationEmbed(payload: ApplicationPayload) {
    const educationLevelLabel = getSchoolLevelLabelById(payload.education.highestLevel)

    return {
      title: '🎓 Éducation et compétences',
      fields: [
        { name: "Plus haut niveau d'éducation", value: educationLevelLabel, inline: true },
        { name: "Domaine d'études", value: payload.education.fieldOfStudy || 'N/A', inline: true },
        {
          name: 'Langues étrangères maîtrisées',
          value: payload.spokenLanguages?.length
            ? payload.spokenLanguages
                .map((l: string) => `* ${getSpokenLanguagesLabelById(l)}`)
                .join('\n')
            : 'Aucune',
        },
      ],
    }
  }

  #buildExperienceEmbed(payload: ApplicationPayload) {
    let description = 'Aucune expérience professionnelle répertoriée.'

    if (payload.professionalExperience && payload.professionalExperience.length > 0) {
      description = payload.professionalExperience
        .map((exp: any) => {
          const duration = exp.isCurrentPosition
            ? `Depuis le : ${exp.startDate}`
            : `De : ${exp.startDate} à : ${exp.endDate}`

          let entry = `**${exp.companyName}**\n*Poste : ${exp.position}*\n${duration}`

          if (!exp.isCurrentPosition && exp.reasonForLeaving) {
            entry += `\n*Raison du départ : ${exp.reasonForLeaving}*`
          }

          return `• ${entry}`
        })
        .join('\n\n')
    }

    return {
      title: '💼 Expérience professionnelle',
      description,
    }
  }

  async #sendOOCSection(url: string, threadId: string, payload: ApplicationPayload) {
    const oocWebhook = await DiscordWebhookService.create({ url })

    oocWebhook.setOptions({
      thread: { id: threadId },
    })

    oocWebhook.addEmbed({
      title: '(( SECTION OOC ))',
      color: 0xff0000,
      description: `**Pseudo Discord** : ${payload.discordUsername}${
        payload.motivationsOOC
          ? `\n\n**Motivations et ambitions** :\n${payload.motivationsOOC}`
          : ''
      }`,
    })

    const result = await oocWebhook.execute()
    if (!result.success) {
      throw new Error(`OOC Discord Webhook failed: ${result.error}`)
    }
  }
}
