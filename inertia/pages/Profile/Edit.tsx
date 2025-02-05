import { useTranslation } from "@/hooks/use_translation";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import { Head } from "@inertiajs/react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import DeleteUserForm from "./Partials/DeleteUserForm";
import Connections from "@/pages/Profile/Partials/Connections";
import FormDivider from "@/components/common/FormDivider/FormDivider";
import type { SharedProps } from "@adonisjs/inertia/types";

const styles = {
    p: {
        md: 4,
        sm: 8,
    },
};

export default function Edit({ auth }: SharedProps) {
    const { t } = useTranslation();

    const user = auth!.user!;

    return (
        <MainLayout bannerTitle={t("settings")} hideBanner>
            <Head title={user.name} />

            <Container>
                <Box sx={styles}>
                    <Connections />

                    <FormDivider />

                    <DeleteUserForm />
                </Box>
            </Container>
        </MainLayout>
    );
}
