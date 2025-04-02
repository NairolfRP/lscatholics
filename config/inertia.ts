import { defineConfig } from "@adonisjs/inertia";
import type { InferSharedProps } from "@adonisjs/inertia/types";
import i18nManager from "@adonisjs/i18n/services/main";
import env from "#start/env";

const inertiaConfig = defineConfig({
    /**
     * Path to the Edge view that will be used as the root view for Inertia responses
     */
    rootView: "inertia_layout",

    /**
     * Data that should be shared with all rendered pages
     */
    sharedData: {
        locale: (ctx) =>
            ctx.inertia.always(() => ctx.i18n?.locale || i18nManager.config.defaultLocale),
        fallbackLocale: (ctx) =>
            ctx.inertia.always(() => ctx.i18n?.fallbackLocale || env.get("FALLBACK_LOCALE")),
        auth: async ({ session, auth }) => {
            if (!(await auth.check())) return { user: null };

            const social = session.get("user_social_info", {});

            const character = social.characters.find(
                (c: { id: number }) => c.id === social.currentCharacter,
            );

            return {
                user: {
                    id: auth.user!.id as number,
                    name: social?.name,
                    avatarURL: social?.avatarURL as string,
                    currentCharacter: {
                        id: character.id,
                        firstname: character.firstname,
                        lastname: character.lastname,
                        fullName: `${character.firstname} ${character.lastname}`,
                    },
                    characters: social.characters
                        .filter((c: { id: number }) => c.id !== character.id)
                        .map((c: { id: number; firstname: string; lastname: string }) => ({
                            id: c.id,
                            name: `${c.firstname} ${c.lastname}`,
                        })),
                },
            };
        },
        notification: (ctx) =>
            ctx.inertia.always(() => ctx.session?.flashMessages.get("notification")),
        success: (ctx) =>
            ctx.inertia.always(() => ctx.session?.flashMessages.get("success") as boolean),
        test: (ctx) => ({ abilities: ctx.bouncer.abilities, policies: ctx.bouncer.policies }),
    },

    /**
     * Options for the server-side rendering
     */
    ssr: {
        enabled: false,
        entrypoint: "inertia/app/ssr.tsx",
    },
});

export default inertiaConfig;

declare module "@adonisjs/inertia/types" {
    export interface SharedProps extends InferSharedProps<typeof inertiaConfig> /*, PageProps*/ {}
}
