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
            <meta name="description" content={t("app_description")} />
            <meta name="author" content="NairolfRP" />

            <meta
                property="discord:title"
                content={`${title} - ${t("archdiocese_of_los_santos")}`}
            />
            <meta property="discord:description" content={t("app_description")} />
            <meta property="discord:image" content={Logo} />

            <link rel="icon" href={Logo} />
            <meta name="theme-color" content="#328FCC" />

            <meta name="application-name" content="(GTA:W) LS Catholics" />
            {children}
        </Head>
    );
}
