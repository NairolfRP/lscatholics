export interface I18nService {
    t: (key: string | string[], options?: Record<string, unknown>) => string;
    changeLanguage: (lang: string) => Promise<void>;
    language: string;
}
