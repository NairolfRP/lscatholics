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

            return {
                user: {
                    id: auth.user!.id as number,
                    name: (social?.mainProvider.nickname || social?.mainProvider.name) as string,
                    avatarURL: social?.mainProvider.avatarURL as string,
                },
            };
        },
        notification: (ctx) =>
            ctx.inertia.always(() => ctx.session?.flashMessages.get("notification")),
        success: (ctx) =>
            ctx.inertia.always(() => ctx.session?.flashMessages.get("success") as boolean),
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
