/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />
/// <reference path="../../config/ally.ts" />
/// <reference path="../../config/auth.ts" />

import "../css/app.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "@adonisjs/inertia/helpers";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { theme } from "@/lib/themes/theme";
import LoadingIndicator from "@/components/loading/LoadingIndicator/LoadingIndicator";
import { SnackbarOrigin, SnackbarProvider } from "notistack";
import { setupI18n } from "@/config/i18n.config";
import { I18nextProvider } from "react-i18next";

const appName = import.meta.env.VITE_APP_NAME ?? ("Archidiocèse de Los Santos" as const);

const SNACKBAR_CONFIG = {
    maxSnack: 3,
    anchorOrigin: {
        vertical: "bottom",
        horizontal: "right",
    } as SnackbarOrigin,
};

createInertiaApp({
    progress: { color: "#5468FF" },

    title: (title) => `${title && `${title} - `}${appName}`,

    resolve: async (name) => {
        try {
            return await resolvePageComponent(
                `../pages/${name}.tsx`,
                import.meta.glob("../pages/**/*.tsx"),
            );
        } catch (e) {
            console.error(`Failed to load page: ${name}`, e);
            const { default: ErrorPage } = await import("../pages/ErrorPage");
            return {
                default: () => <ErrorPage error={{ status: 404 }} />,
            };
        }
    },

    setup: async ({ el, App, props }) => {
        const { locale, fallbackLocale } = props.initialPage.props as unknown as {
            locale: string;
            fallbackLocale?: string;
        };

        const i18nInstance = await setupI18n({ locale, fallbackLocale });

        createRoot(el).render(
            <StrictMode>
                <I18nextProvider i18n={i18nInstance}>
                    <ThemeProvider theme={theme} defaultMode="light" noSsr>
                        <CssBaseline />
                        <SnackbarProvider {...SNACKBAR_CONFIG}>
                            <App {...props} />
                        </SnackbarProvider>
                        <LoadingIndicator />
                    </ThemeProvider>
                </I18nextProvider>
            </StrictMode>,
        );
    },
});
