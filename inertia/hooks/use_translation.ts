import type { I18nService } from "@/types/i18n";
import { useTranslation as useReactI18nextTranslation } from "react-i18next";

export function useTranslation(): I18nService {
    const { t, i18n } = useReactI18nextTranslation();

    return {
        t: (key: string | string[], options?: Record<string, unknown>) => t(key, options),
        changeLanguage: async (lang: string): Promise<void> => {
            if (i18n.language !== lang) {
                await i18n.changeLanguage(lang);
            }
        },
        language: i18n.language,
    };
}
