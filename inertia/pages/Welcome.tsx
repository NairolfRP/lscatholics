import HomeBanner from "@/assets/images/homebanner.png";
import EventCard from "@/features/events/components/EventCard/EventCard";
import type { EventArticle } from "@/features/events/types/events";
import { useTranslation } from "@/hooks/use_translation";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import type { PageProps } from "@/types/page_props";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { Key } from "react";

export default function Welcome({
    events,
}: PageProps<{
    events: EventArticle[];
}>) {
    const { t } = useTranslation();

    const hasEvents = events.length > 0;

    return (
        <>
            {/*<Head title="Welcome" />*/}
            <MainLayout bannerImg={HomeBanner}>
                <Box component="section" id="events" sx={{ bgcolor: "secondary.main" }}>
                    <Container>
                        <Typography
                            sx={{ display: "flex" }}
                            variant="h2"
                            color="secondary.contrastText"
                            component="h2"
                            paddingTop={{ tablet: 2, mobile: 2, desktop: 3 }}
                            alignItems="center"
                            justifyContent="center"
                            flexWrap="wrap"
                            gutterBottom
                        >
                            <CalendarMonthIcon fontSize="inherit" sx={{ mr: 2 }} />{" "}
                            {t("upcoming_events")}
                        </Typography>
                    </Container>
                    {hasEvents ? (
                        <Grid container sx={{ height: { mobile: "85vh", tablet: "45vh" } }}>
                            {events.map((article: EventArticle, index: Key | null | undefined) => (
                                <Grid
                                    key={index}
                                    size={{ xs: 10, md: 4, tablet: 4, mobile: 12 }}
                                    sx={{ display: "flex" }}
                                    flexDirection="column"
                                >
                                    <EventCard article={article} />
                                </Grid>
                            ))}
                        </Grid>
                    ) : (
                        <Typography
                            sx={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}
                            variant="h4"
                            color="secondary.contrastText"
                        >
                            {t("no_upcoming_events")}
                        </Typography>
                    )}
                </Box>
            </MainLayout>
        </>
    );
}
