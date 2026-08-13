import { setResponseStatus } from '@tanstack/react-start/server'
import { isPast } from 'date-fns'
import { z } from 'zod'
import { env } from '#/config/env.server.ts'
import {
  APPLICATION_SOURCE,
  applicationSourceLabels,
  GENDER,
  schoolLevelLabels,
  spokenLanguageLabels,
} from '#/features/job-application/constants/employment-application.constants.tsx'
import type {
  EmploymentApplicationOutput,
} from '#/features/job-application/schemas/employment-application.schema.ts'
import {
  employmentApplicationSchema,
} from '#/features/job-application/schemas/employment-application.schema.ts'
import { formatIban } from '#/utils/bank.ts'
import { getFieldErrors } from '#/utils/form.ts'
import { truncate } from '#/utils/string.ts'
import { logger } from '#server/integrations/logger.ts'
import { jobPostingRepository } from '#server/repositories/job-posting.repository.ts'
import type { DiscordEmbed } from '#server/services/discord.service.ts'
import { sendWebhookMessage } from '#server/services/discord.service.ts'
import { getDistrictLabel } from '#shared/constants/districts.constants.ts'
import type { User } from '#shared/lib/types/auth.ts'

export const JOB_APPLICATION_EMBED_COLOR = 0x1e40af

export async function submit({ slug, data, user }: { slug: string; data: unknown; user: User }) {
  const webhookUrl = env.JOB_APPLICATION_DISCORD_WEBHOOK

  try {
    if (!webhookUrl) {
      logger.error('Missing JOB_APPLICATION_DISCORD_WEBHOOK environment variable')
      setResponseStatus(500)
      return {
        success: false,
        error: 'Les candidatures en ligne sont temporairement désactivées. Réessayez plus tard.',
      }
    }

    const validatedData = await employmentApplicationSchema.parseAsync(data)

    const job = await jobPostingRepository.getJobPosting({
      slug,
      columns: { title: true, isActive: true, expiresAt: true },
      includeExpired: true,
      includeInactive: true,
    })

    if (!job) {
      setResponseStatus(404)
      return { success: false, error: "Cette offre d'emploi n'existe plus." }
    }

    if (!job.isActive || (job.expiresAt && isPast(new Date(job.expiresAt)))) {
      setResponseStatus(410)
      return { success: false, error: "Cette offre d'emploi n'accepte plus de candidatures." }
    }

    const threadName = truncate(`[${job.title}] ${buildFullName(validatedData)}`, 100)

    const firstMessage = await sendWebhookMessage({
      url: webhookUrl,
      wait: true,
      payload: {
        thread_name: threadName,
        embeds: buildMainEmbeds(job.title, validatedData),
      },
    })

    const threadId = firstMessage?.channel_id
    if (!threadId) {
      throw new Error('Failed to retrieve the Discord thread ID')
    }

    await sendWebhookMessage({
      url: webhookUrl,
      threadId,
      payload: {
        embeds: [buildOOCEmbed(validatedData)],
      },
    })

    return { success: true }
  } catch (err) {
    if (err instanceof z.ZodError) {
      const validationErrors = getFieldErrors(err)
      setResponseStatus(400)
      return { success: false, validationErrors }
    }

    logger.error({ err, slug, userId: user.id }, 'Failed to submit a job application')
    setResponseStatus(500)
    return { success: false, error: 'Une erreur est survenue' }
  }
}

function buildMainEmbeds(jobTitle: string, data: EmploymentApplicationOutput): DiscordEmbed[] {
  return [buildMainInfoEmbed(jobTitle, data), buildEducationEmbed(data), buildExperienceEmbed(data)]
}

function buildMainInfoEmbed(jobTitle: string, data: EmploymentApplicationOutput): DiscordEmbed {
  const fields: DiscordEmbed['fields'] = [{ name: 'Prénom', value: data.firstname, inline: true }]

  if (data.middleName) {
    fields.push({ name: 'Deuxième prénom', value: data.middleName, inline: true })
  }

  const districtLabel = getDistrictLabel(data.district)

  fields.push(
    { name: 'Nom de famille', value: data.lastname, inline: true },
    {
      name: 'Genre',
      value: data.gender === GENDER.FEMALE ? ':female_sign:' : ':male_sign:',
    },
    { name: 'Âge', value: `${data.age}` },
    {
      name: 'Adresse',
      value: `${data.address}${districtLabel ? ` (${districtLabel})` : ''}`,
    },
    { name: 'Numéro de téléphone', value: data.phone, inline: true },
    { name: 'IBAN', value: '``' + formatIban(data.iban) + '``', inline: true },
    {
      name: 'Catholique pratiquant ?',
      value: data.isPracticingCatholic ? ':ballot_box_with_check:' : ':x:',
    },
    {
      name: 'Permis de conduire ?',
      value: data.hasDriverLicense ? ':ballot_box_with_check:' : ':x:',
    }
  )

  if (data.applicationSource.type) {
    fields.push({
      name: "Source de l'offre",
      value: applicationSourceLabels[data.applicationSource.type],
    })

    if (
      data.applicationSource.type === APPLICATION_SOURCE.EMPLOYEE_REFERRAL &&
      data.applicationSource.employeeReferral
    ) {
      fields.push({
        name: 'Employé référent',
        value: data.applicationSource.employeeReferral,
      })
    }
  }

  return {
    author: {
      name: 'LS Catholics',
      icon_url: 'https://i.imgur.com/0f4ZQS0.png',
    },
    title: `[${jobTitle}] Demande d'emploi de ${buildFullName(data)}`,
    color: JOB_APPLICATION_EMBED_COLOR,
    fields,
    timestamp: new Date().toISOString(),
  }
}

function buildEducationEmbed(data: EmploymentApplicationOutput): DiscordEmbed {
  return {
    title: '🎓 Éducation et compétences',
    fields: [
      {
        name: "Plus haut niveau d'éducation",
        value: schoolLevelLabels[data.education.highestLevel],
        inline: true,
      },
      {
        name: "Domaine d'études",
        value: data.education.fieldOfStudy || 'N/A',
        inline: true,
      },
      {
        name: 'Langues étrangères maîtrisées',
        value: data.spokenLanguages.length
          ? data.spokenLanguages.map((language) => `* ${spokenLanguageLabels[language]}`).join('\n')
          : 'Aucune',
      },
    ],
  }
}

function buildExperienceEmbed(data: EmploymentApplicationOutput): DiscordEmbed {
  if (data.professionalExperience.length === 0) {
    return {
      title: '💼 Expérience professionnelle',
      description: 'Aucune expérience professionnelle répertoriée.',
    }
  }

  const description = data.professionalExperience
    .map((experience) => {
      const duration = experience.isCurrentPosition
        ? `Depuis le : ${formatYearMonth(experience.startDate)}`
        : `De : ${formatYearMonth(experience.startDate)} à : ${formatYearMonth(experience.endDate)}`

      let entry = `**${experience.companyName}**\n*Poste : ${experience.position}*\n${duration}`

      if (!experience.isCurrentPosition && experience.reasonForLeaving) {
        entry += `\n*Raison du départ : ${experience.reasonForLeaving}*`
      }

      return `• ${entry}`
    })
    .join('\n\n')

  return {
    title: '💼 Expérience professionnelle',
    description,
  }
}

function buildOOCEmbed(data: EmploymentApplicationOutput): DiscordEmbed {
  const description = `**Pseudo Discord** : ${data.discordUsername}${
    data.motivationsOOC ? `\n\n**Motivations et ambitions** :\n${data.motivationsOOC}` : ''
  }`

  return {
    title: '(( SECTION OOC ))',
    color: 0xff0000,
    description,
  }
}

function buildFullName(data: { firstname: string; middleName?: string; lastname: string }) {
  return `${data.firstname}${data.middleName ? ` ${data.middleName} ` : ' '}${data.lastname}`
}

function formatYearMonth(value: string) {
  const [year, month] = value.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('fr-FR', {
    month: 'long',
    year: 'numeric',
  })
}
