import i18n from "i18next";
import { initReactI18next } from "react-i18next";

export const setupI18n = async () => {
    await i18n.use(initReactI18next).init({
        resources: {
            fr: await import("@/locales/fr.json"),
            en: await import("@/locales/en.json"),
        },
        lng: "fr",
        fallbackLng: "en",
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
