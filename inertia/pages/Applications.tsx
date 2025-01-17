import { useTranslation } from "@/hooks/useTranslation";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import { Head } from "@inertiajs/react";
import Container from "@mui/material/Container";

export default function Applications() {
    const { t } = useTranslation();

    return (
        <MainLayout bannerTitle={t("applications")}>
            <Head title={t("applications")} />
            <Container>ssss</Container>
        </MainLayout>
    );
}
