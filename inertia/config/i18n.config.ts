import i18n from "i18next";
import ICU from "i18next-icu";
import { initReactI18next } from "react-i18next";

export const setupI18n = async ({
    locale,
    fallbackLocale,
}: {
    locale: string;
    fallbackLocale?: string;
}) => {
    await i18n
        .use(ICU)
        .use(initReactI18next)
        .init({
            resources: {
                fr: await import("../../resources/lang/fr/fr.json"),
                en: await import("../../resources/lang/en/en.json"),
            },
            lng: locale,
            fallbackLng: fallbackLocale,
            debug: true,
            interpolation: {
                escapeValue: false,
            },
        });

    /*router.on("navigate", (event) => {
        const newLocale = event.detail.page.props.locale;
        if (newLocale && i18n.language !== newLocale) i18n.changeLanguage(newLocale);
    });*/
};
