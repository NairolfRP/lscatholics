import type { EventArticle } from "@/features/events/types/events";
import { useTranslation } from "@/hooks/use_translation";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import type { PageProps } from "@/types/page_props";
import { Head } from "@inertiajs/react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Link from "@/components/common/Link/Link";
import Typography from "@mui/material/Typography";

export default function SingleEvent({ event }: PageProps<{ event: EventArticle }>) {
    const { t } = useTranslation();

    const date = new Date(event.datetime);

    const formattedDate = t("datetime", {
        day: ("0" + date.getDay()).slice(-2),
        month: ("0" + date.getMonth()).slice(-2),
        year: date.getFullYear(),
        hours: date.getHours(),
        minutes: date.getMinutes(),
    });

    return (
        <MainLayout bannerImg={event.image} bannerTitle={event.title}>
            <Head title={event.title} />
            <Container sx={{ mt: 3 }}>
                <Button
                    component={Link}
                    href="/find/events"
                    color="primary"
                    variant="contained"
                    sx={{ mb: 4 }}
                    startIcon={<ArrowBackIcon />}
                >
                    {t("all_events")}
                </Button>
                <Typography variant="h5" fontWeight={800}>
                    {formattedDate}
                </Typography>
                <Typography sx={{ mt: 3, mb: 5 }}>{event.description}</Typography>
            </Container>
        </MainLayout>
    );
}
