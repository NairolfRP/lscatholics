import { HttpContext } from "@adonisjs/core/http";
import { z } from "zod";
import { FleecaPaymentService } from "#services/fleeca_payment_service";
import { inject } from "@adonisjs/core";
import type { DonationMetaData, PaymentIntent } from "#services/payment/interface";
import env from "#start/env";
import { DiscordWebhookService } from "#services/discord/discord_webhook_service";
import { DiscordEmbedService } from "#services/discord/discord_embed_service";

@inject()
export default class DonateController {
    constructor(protected service: FleecaPaymentService) {}

    private initiateDonation({ amount, data }: { amount: number; data: DonationMetaData }): string {
        const payment = this.service.createPaymentIntent({
            type: "donation",
            price: amount,
            metadata: data,
        });

        if (!payment) throw Error("Failed to create a new payment");

        return this.service.getPaymentAuthorizationURL({ price: amount });
    }

    async show({ inertia }: HttpContext) {
        return inertia.render("Donate/Donate");
    }

    async submit({ session, response, request, inertia, i18n }: HttpContext) {
        const validationSchema = z.object({
            firstname: z
                .string({ required_error: "Firstname is required" })
                .max(50, { message: "Firstname cannot exceed 50 characters." }),
            lastname: z
                .string({ required_error: "Lastname is required" })
                .max(50, { message: "Firstname cannot exceed 50 characters." }),
            age: z.nullable(
                z
                    .number({
                        required_error: "Age is required",
                    })
                    .min(16, { message: "Minimum age is 16." })
                    .max(125, { message: "Age cannot exceed 125." }),
            ),
            phone: z.nullable(
                z
                    .number({ message: "Not a valid phone number" })
                    .min(100, { message: "Phone must have at least 3 digits." })
                    .max(99999999, { message: "Phone cannot exceed 8 digits." }),
            ),
            organization: z.nullable(
                z.string().min(2, { message: "Must be at least 2 characters." }),
            ),
            anonymous: z.boolean({
                invalid_type_error: "“Anonymous” is supposed to be a Boolean.",
            }),
            amount: z
                .number({
                    required_error: "Amount is required",
                    invalid_type_error: "Amount must be a number",
                })
                .min(1, { message: "The minimum amount is 200." })
                .positive({ message: "Amount must have a positive number." }),
            confirmation: z.boolean({
                required_error:
                    "Please read, approve and check the confirmation checkbox when you are ready.",
            }),
        });

        const validation = await request.validate(validationSchema);

        if (!validation) return;

        try {
            const { confirmation, amount, ...data } = validation;
            const gatewayURL = this.initiateDonation({ amount, data });

            return inertia.render("Donate/Donate", {
                fleecaGatewayURL: gatewayURL,
            });
        } catch (e) {
            console.error("Error after donation form submission", e);
            this.service.deletePaymentIntent();
            session.flashErrors({ errorMessage: i18n.t("common.an_error_occurred") });
            return response.redirect().back();
        }
    }

    public static async processDonation({ i18n }: HttpContext, intent: PaymentIntent<"donation">) {
        try {
            if (intent.type !== "donation") {
                throw Error(
                    `Cannot process donation, because this intent has the type '${intent.type}'`,
                );
            }

            const { firstname, lastname, age, phone, organization, anonymous } = intent.metadata;

            const amount = intent.price;
            const donator = `${firstname} ${lastname}`;

            const formattedAmount = amount.toLocaleString("en-US", {
                style: "currency",
                currency: "USD",
                minimumFractionDigits: 0,
            });

            const privateAnnounceWebhookURL = env.get("DONATE_DISCORD_WEBHOOK");
            const publicAnnounceWebhookURL = env.get("DONATE_PUBLIC_DISCORD_WEBHOOK");

            const waitingDiscordPromises: Promise<boolean>[] = [];

            if (privateAnnounceWebhookURL) {
                const privateAnnounceDiscordEmbed = DiscordEmbedService.create({
                    title: i18n.t("donations.discord.private_announce_embed.title"),
                    timestamp: new Date(Date.now()).toISOString(),
                }).addField({
                    name: i18n.t("common.identity"),
                    value: donator,
                });

                if (organization) {
                    privateAnnounceDiscordEmbed.addField({
                        name: i18n.t("donations.discord.private_announce_embed.organization_field"),
                        value: organization,
                    });
                }

                if (age) {
                    privateAnnounceDiscordEmbed.addField({
                        name: i18n.t("donations.discord.private_announce_embed.age_field"),
                        value: age.toString(),
                    });
                }

                if (phone) {
                    privateAnnounceDiscordEmbed.addField({
                        name: i18n.t("donations.discord.private_announce_embed.phone_field"),
                        value: phone.toString(),
                    });
                }

                privateAnnounceDiscordEmbed.addField({
                    name: i18n.t("donations.discord.private_announce_embed.amount_field"),
                    value: formattedAmount,
                });

                privateAnnounceDiscordEmbed.addField({
                    name: i18n.t("donations.discord.private_announce_embed.anonymous_field"),
                    value: anonymous ? "⛔" : "✅",
                });

                const discordWebhookInstance = DiscordWebhookService.create(
                    privateAnnounceWebhookURL,
                    {
                        embeds: [privateAnnounceDiscordEmbed],
                    },
                );

                waitingDiscordPromises.push(discordWebhookInstance.send());
            }

            if (!anonymous && publicAnnounceWebhookURL) {
                let embedDescriptionKey = i18n.t(
                    "donations.discord.public_announce_embed.description.without_age_and_organization",
                    {
                        name: donator,
                        amount: formattedAmount,
                    },
                );

                if (age && organization) {
                    embedDescriptionKey = i18n.t(
                        "donations.discord.public_announce_embed.description.with_age_and_organization",
                        {
                            name: donator,
                            amount: formattedAmount,
                            age,
                            organization,
                        },
                    );
                } else if (organization) {
                    embedDescriptionKey = i18n.t(
                        "donations.discord.public_announce_embed.description.with_organization",
                        {
                            name: donator,
                            amount: formattedAmount,
                            organization,
                        },
                    );
                } else if (age) {
                    embedDescriptionKey = i18n.t(
                        "donations.discord.public_announce_embed.description.with_age",
                        {
                            name: donator,
                            amount: formattedAmount,
                            age,
                        },
                    );
                }

                let publicAnnounceDiscordEmbedColor;

                switch (true) {
                    case amount >= 1000000:
                        publicAnnounceDiscordEmbedColor = 16774912;
                        break;
                    case amount >= 100000:
                        publicAnnounceDiscordEmbedColor = 11403519;
                        break;
                    case amount >= 50000:
                        publicAnnounceDiscordEmbedColor = 4607;
                        break;
                    default:
                        publicAnnounceDiscordEmbedColor = 358886;
                        break;
                }

                const publicAnnounceDiscordEmbed = DiscordEmbedService.create({
                    title: i18n.t("donations.discord.public_announce_embed.title"),
                    url: env.get("APP_URL") + "/donate",
                    description: embedDescriptionKey,
                    color: publicAnnounceDiscordEmbedColor,
                    image: { url: "https://i.imgur.com/sZX0DD2.jpeg" },
                    timestamp: new Date(Date.now()).toISOString(),
                });

                const publicAnnounceDiscordWebhookInstance = DiscordWebhookService.create(
                    publicAnnounceWebhookURL,
                    {
                        embeds: [publicAnnounceDiscordEmbed],
                    },
                );

                waitingDiscordPromises.push(publicAnnounceDiscordWebhookInstance.send());
            }

            if (waitingDiscordPromises.length > 0) {
                await Promise.all(waitingDiscordPromises);
            }
        } catch (e) {
            console.error(e);
        }
    }
}
