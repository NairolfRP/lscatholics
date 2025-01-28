import { useTranslation } from "@/hooks/use_translation";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import { PageProps } from "@/types/page_props";
import { Head } from "@inertiajs/react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import DeleteUserForm from "./Partials/DeleteUserForm";

const styles = {
    p: {
        md: 4,
        sm: 8,
    },
};

export default function Edit({ auth }: Partial<PageProps>) {
    const { t } = useTranslation();

    return (
        <MainLayout bannerTitle={t("settings")}>
            <Head title={auth.user.name} />

            <Container>
                <Box sx={styles}>
                    <DeleteUserForm user={auth.user} />
                </Box>
            </Container>
        </MainLayout>
    );
}
