import DashboardLayout from "@/layouts/DashboardLayout/DashboardLayout";
import Head from "@/components/AppHead";
import { useTranslation } from "@/hooks/use_translation";
import Typography from "@mui/material/Typography";
import { type SharedProps } from "@adonisjs/inertia/types";
import Trans from "@/components/locales/Trans/Trans";
import Divider from "@mui/material/Divider";
import { useEffect } from "react";

export default function Dashboard({ test, auth }: SharedProps) {
    const { t } = useTranslation();

    useEffect(() => {
        console.log(test);
    }, []);
    return (
        <DashboardLayout>
            <Head title={t("dashboard")} />
            <Typography color="primary" variant="h2">
                <Trans i18nKey="welcome_user" values={{ name: auth.user!.name }} />
            </Typography>
            <Divider sx={(theme) => ({ mb: theme.spacing(2) })} />
        </DashboardLayout>
    );
}
