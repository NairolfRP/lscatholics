import type { HttpContext } from "@adonisjs/core/http";
import { z } from "zod";
import { DiscordEmbedService } from "#services/discord/discord_embed_service";
import { DiscordWebhookService } from "#services/discord/discord_webhook_service";
import CharacterService from "#services/character_service";
import { inject } from "@adonisjs/core";

@inject()
export default class ContactsController {
    constructor(protected characterService: CharacterService) {}

    async show({ inertia }: HttpContext) {
        return inertia.render("Contact");
    }

    async submit({ response, request }: HttpContext) {
        const validationSchema = z.object({
            firstname: z
                .string({ required_error: "Firstname is required" })
                .min(1, { message: "Firstname is required" })
                .max(50, { message: "Firstname must not exceed 50 characters" }),

            lastname: z
                .string({ required_error: "Lastname is required" })
                .min(1, { message: "Lastname is required" })
                .max(50, { message: "Lastname must not exceed 50 characters" }),

            phone: z
                .string({ required_error: "Phone is required" })
                .min(1, { message: "Phone is required" })
                .regex(/^\d+$/, { message: "Phone must only contain digits" })
                .min(3, { message: "Phone must contain at least 3 digits" })
                .max(20, { message: "Phone must not exceed 20 digits" }),

            message: z
                .string({ required_error: "Message is required" })
                .min(1, { message: "Message is required" })
                .min(3, { message: "Message must contain at least 3 characters" })
                .max(3000, { message: "Message must not exceed 3 000 characters" }),
        });

        await this.characterService.syncCurrentCharacterWithRequestBody();

        const validation = await request.validate(validationSchema);

        if (!validation) return;

        try {
            const discordWebhookURL = process.env.DISCORD_CONTACT_WEBHOOK;
            const discordTagID = process.env.DISCORD_CONTACT_WEBHOOK_TAG_ID;

            if (discordWebhookURL) {
                const threadName = `${validation.firstname} ${validation.lastname}`;

                const personalInformationEmbed = DiscordEmbedService.create({
                    title: "general.personnal_information",
                })
                    .addField({
                        name: "general.firstname",
                        value: validation.firstname,
                        inline: true,
                    })
                    .addField({
                        name: "general.lastname",
                        value: validation.lastname,
                        inline: true,
                    })
                    .addField({
                        name: "general.phone",
                        value: validation.phone,
                    });

                const messageEmbed = DiscordEmbedService.create({
                    title: "general.message",
                    description: validation.message,
                    timestamp: new Date(Date.now()).toISOString(),
                });

                const discordResponse = await DiscordWebhookService.create(discordWebhookURL, {
                    threadName,
                    tags: discordTagID ? [discordTagID] : [],
                    embeds: [personalInformationEmbed, messageEmbed],
                }).send();

                if (!discordResponse) {
                    throw Error("Failed to send Contact Discord Notification");
                }
            }

            return response.redirect().back();
        } catch (e) {
            throw e;
        }
    }
}
