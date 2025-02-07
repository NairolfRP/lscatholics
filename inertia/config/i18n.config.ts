import i18n from "i18next";
import ICU from "i18next-icu";
import { initReactI18next } from "react-i18next";
import FR from "../../resources/lang/fr/fr.json" with { type: "json" };
import EN from "../../resources/lang/en/en.json" with { type: "json" };

let i18nInstance: typeof i18n | null = null;

export const setupI18n = async ({
    locale,
    fallbackLocale = "en",
}: {
    locale: string;
    fallbackLocale?: string;
}) => {
    if (
        i18nInstance?.isInitialized &&
        i18nInstance.language === locale &&
        i18nInstance.options?.fallbackLng === fallbackLocale
    ) {
        return i18nInstance;
    }

    const config = {
        resources: {
            fr: FR,
            en: EN,
        },
        lng: locale,
        fallbackLng: fallbackLocale,
        debug: true,
        interpolation: {
            escapeValue: false,
        },
        load: "currentOnly",
        returnNull: false,
        returnEmptyString: false,
        supportedLngs: ["fr", "en"],
        react: {
            useSuspense: false,
        },
    } as const;

    i18nInstance = i18n.use(ICU).use(initReactI18next);

    await i18nInstance.init(config);

    return i18nInstance;
};

export const getI18nInstance = () => i18nInstance;
