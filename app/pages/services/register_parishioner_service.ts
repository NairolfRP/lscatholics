import {
  getCivilTitleLabelById,
  getHouseholdRoleLabelById,
  getIndividualSacramentLabelById,
  getMaritalStatusLabelById,
} from '#shared/constants/person.constants'
import { RegisterParishionerPayload } from '#pages/validators/register_parishioner'
import {
  getLocalEthnicCommunityDiscordTag,
  getLocalEthnicCommunityLabelById,
} from '#shared/constants/ethnicity.constants'
import { DiscordWebhookService } from '#discord/services/discord_webhook_service'
import { getDistrictLabelById } from '#shared/constants/districts.constants'

export class RegisterParishionerService {
  private static formatFamilyMembers(members: RegisterParishionerPayload['familyMembers']): string {
    if (!members || members.length === 0) return 'Aucun membre'

    return members
      .map((m) => {
        const npcTag = m.isNpc ? ' (( PNJ ))' : ''
        const roleLabel = getHouseholdRoleLabelById(m.role)
        return `* ${m.firstname} ${m.lastname} (${m.age} ans - ${roleLabel})${npcTag}`
      })
      .join('\n')
  }

  private static formatOOCInfo(sacraments?: string[], additionalInfo?: string): string | null {
    if (!sacraments?.length && !additionalInfo) return null

    let content = ''

    if (additionalInfo) {
      content += `**Qu'est-ce que le clergé de l'archidiocèse de Los Santos est censé savoir en RP sur votre personnage ?**\n>>> ${additionalInfo}\n\n`
    }

    if (sacraments?.length) {
      const sacramentsLabels = sacraments
        .map((s) => getIndividualSacramentLabelById(s))
        .filter(Boolean)
        .join(', ')

      if (sacramentsLabels) {
        content += `**Votre personnage a reçu les sacrements de...** :\n${sacramentsLabels}`
      }
    }

    return content
  }

  private static getParishName(parishId: number): string {
    const parishes: Record<number, string> = {
      1: 'Cathédrale Notre-Dame-des-Saints',
      2: 'Église du Bon Pasteur',
      3: 'Eglise Nuestra Señora Reina de Los Santos',
    }
    return parishes[parishId] || 'N/A'
  }

  static async register(
    webhookUrl: string | undefined,
    payload: RegisterParishionerPayload
  ): Promise<{ success: boolean; error?: string }> {
    try {
      if (!webhookUrl || webhookUrl.trim() === '') {
        return {
          success: false,
          error: 'Discord webhook URL missing from configuration',
        }
      }

      const threadTitle = `Foyer de ${payload.firstname} ${payload.lastname}`
      const ethnicDiscordTag = getLocalEthnicCommunityDiscordTag(payload.ethnicCommunity)
      const districtLabel = getDistrictLabelById(payload.district)

      const discordWebhook = await DiscordWebhookService.create({ url: webhookUrl })

      discordWebhook.setOptions({
        thread: {
          name: threadTitle,
          tags: ethnicDiscordTag ? [ethnicDiscordTag] : undefined,
        },
      })

      discordWebhook.addEmbed({
        title: threadTitle,
        fields: [
          {
            name: 'Titre de civilité',
            value: getCivilTitleLabelById(payload.civilTitle) || 'N/A',
          },
          {
            name: 'État matrimonial',
            value: getMaritalStatusLabelById(payload.maritalStatus) || 'N/A',
          },
          {
            name: 'Identité',
            value: `${payload.firstname} ${payload.lastname}`,
          },
          {
            name: 'Sexe',
            value: payload.gender === 'female' ? 'F' : 'M',
          },
          {
            name: 'Âge',
            value: `${payload.age} ans`,
          },
          {
            name: 'Communauté ethnique spécifique ?',
            value: getLocalEthnicCommunityLabelById(payload.ethnicCommunity) || 'N/A',
          },
          {
            name: 'Activité / emploi',
            value: payload.occupation || 'N/A',
          },
          {
            name: 'Numéro de téléphone',
            value: payload.phone,
          },
          {
            name: "N° de téléphone à appeler en cas d'urgence",
            value: payload.emergencyPhone || 'N/A',
          },
          {
            name: 'Adresse',
            value: `${payload.address}${districtLabel ? ` (${districtLabel})` : ''}`,
          },
          {
            name: 'Baptisé',
            value:
              payload.baptized === 'unsure' ? 'Pas sûr' : payload.baptized === 'yes' ? '✅' : '❌',
          },
          {
            name: 'Religion',
            value:
              payload.religion === 'catholic'
                ? 'Catholique'
                : payload.religion === 'other'
                  ? 'Autre'
                  : 'N/A',
          },
          {
            name: 'Paroisse',
            value: this.getParishName(payload.parish),
          },
        ],
        timestamp: new Date().toISOString(),
      })

      if (payload.message) {
        discordWebhook.addEmbed({
          title: 'Informations complémentaires',
          description: payload.message,
        })
      }

      if (payload.familyMembers && payload.familyMembers.length > 0) {
        discordWebhook.addEmbed({
          title: `Membres du foyer (${payload.familyMembers.length})`,
          description: this.formatFamilyMembers(payload.familyMembers),
        })
      }

      const oocContent = this.formatOOCInfo(
        payload.characterSacraments,
        payload.oocAdditionalInformation
      )

      if (oocContent) {
        discordWebhook.addEmbed({
          title: '(( Partie OOC ))',
          description: oocContent,
        })
      }

      const result = await discordWebhook.execute()

      if (!result.success) {
        return {
          success: false,
          error: 'Failed to send to Discord server',
        }
      }

      return { success: true }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }
}
