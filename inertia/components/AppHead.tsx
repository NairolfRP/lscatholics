import { Head } from "@inertiajs/react";
import type { ComponentProps, PropsWithChildren } from "react";
import { useTranslation } from "@/hooks/use_translation";
import Logo from "@/assets/images/logo.png";

export default function AppHead({
    title,
    children,
}: PropsWithChildren<ComponentProps<typeof Head>>) {
    const { t } = useTranslation();
    return (
        <Head title={title}>
            <meta head-key="description" name="description" content={t("app_description")} />
            <meta head-key="author" name="author" content="NairolfRP" />

            <meta head-key="og:type" property="og:type" content="website" />
            <meta
                head-key="og:title"
                property="og:title"
                content={`${title} - ${t("archdiocese_of_los_santos")}`}
            />
            <meta
                head-key="og:description"
                property="og:description"
                content={t("app_description")}
            />
            <meta head-key="og:image" property="og:image" content={Logo} />
            <meta
                head-key="og:site_name"
                property="og:site_name"
                content={t("archdiocese_of_los_santos")}
            />

            <meta head-key="twitter:card" name="twitter:card" content="summary" />
            <meta
                head-key="twitter:title"
                content={`${title} - ${t("archdiocese_of_los_santos")}`}
            />
            <meta
                head-key="twitter:description"
                name="twitter:description"
                content={t("app_description")}
            />
            <meta head-key="twitter:image" name="twitter:image" content={Logo} />

            <link rel="icon" href={Logo} />
            <meta name="theme-color" content="#328FCC" />

            <meta name="application-name" content="(GTA:W) LS Catholics" />
            {children}
        </Head>
    );
}
