import { defineConfig } from "@adonisjs/inertia";
import type { InferSharedProps, PageProps } from "@adonisjs/inertia/types";

const inertiaConfig = defineConfig({
    /**
     * Path to the Edge view that will be used as the root view for Inertia responses
     */
    rootView: "inertia_layout",

    /**
     * Data that should be shared with all rendered pages
     */
    sharedData: {
        auth: async ({ session, auth }) => {
            const social = session.get("user_social_info", null);
            return {
                user: (await auth.check())
                    ? {
                          id: auth.user!.id,
                          name: auth.user!.name,
                          avatarURL: social?.avatarURL,
                          token: social?.token,
                      }
                    : null,
            };
        },
        errors: (ctx) => ctx.inertia.always(() => ctx.session?.flashMessages.get("errors")),
        notification: (ctx) =>
            ctx.inertia.always(() => ctx.session?.flashMessages.get("notification")),
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
    export interface SharedProps extends InferSharedProps<typeof inertiaConfig>, PageProps {}
}
