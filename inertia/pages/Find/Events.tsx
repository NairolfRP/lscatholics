import EventsBanner from "@/assets/images/eventsbanner.png";
import EventCard from "@/features/events/components/EventCard/EventCard";
import { EventArticle } from "@/features/events/types/events";
import { useEventCallback } from "@/hooks/useEventCallback";
import { useTranslation } from "@/hooks/useTranslation";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import { Head, router } from "@inertiajs/react";
import { Pagination } from "@mui/material";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { ChangeEvent, Suspense, useMemo } from "react";

export default function Events({
    events,
}: {
    events: {
        currentPage: number;
        perPage: number;
        total: number;
        lastPage: number;
        items: EventArticle[];
    };
}) {
    const { t } = useTranslation();

    const thereAreEvents = useMemo(
        () => Array.isArray(events?.items) && events?.items.length > 0,
        [events],
    );

    const handlePaginationChange = useEventCallback(
        (_event: ChangeEvent<unknown>, page: number) => {
            router.visit(`/find/events?page=${page}`, {
                preserveScroll: true,
            });
        },
    );

    return (
        <MainLayout bannerImg={EventsBanner} bannerTitle={t("find_event")}>
            <Head title={t("find_event")} />

            <Container maxWidth="xl" sx={{ mt: 3, mb: 10 }}>
                <Suspense>
                    {thereAreEvents ? (
                        <>
                            <Pagination
                                color="secondary"
                                size="large"
                                sx={{ mt: 5, mb: 5 }}
                                count={events.lastPage}
                                page={events.currentPage}
                                onChange={handlePaginationChange}
                            />

                            <Grid
                                container
                                sx={{ height: { mobile: "165vh", tablet: "125vh" } }}
                                spacing={1}
                            >
                                {events.items.map((event: EventArticle) => (
                                    <Grid
                                        key={event.id}
                                        size={{ xs: 10, md: 4, tablet: 12, mobile: 12 }}
                                        sx={{ display: "flex" }}
                                        flexDirection="column"
                                    >
                                        <EventCard article={event} />
                                    </Grid>
                                ))}
                            </Grid>

                            <Pagination
                                color="secondary"
                                size="large"
                                sx={{ mt: 5 }}
                                count={events.lastPage}
                                page={events.currentPage}
                                onChange={handlePaginationChange}
                            />
                        </>
                    ) : (
                        <Typography component="p" variant="h4">
                            {t("no_upcoming_events")}
                        </Typography>
                    )}
                </Suspense>
            </Container>
        </MainLayout>
    );
}
