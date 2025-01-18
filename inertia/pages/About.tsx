import PageBanner from "@/assets/images/homebanner.png";
import { useTranslation } from "@/hooks/useTranslation";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import { Head } from "@inertiajs/react";
import ChurchIcon from "@mui/icons-material/Church";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import HistoryEduIcon from "@mui/icons-material/HistoryEdu";
import LanguageIcon from "@mui/icons-material/Language";
import LocationCityIcon from "@mui/icons-material/LocationCity";
import SchoolIcon from "@mui/icons-material/School";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";

export default function About() {
    const { t } = useTranslation();

    return (
        <MainLayout bannerTitle={t("who_we_are")} bannerImg={PageBanner}>
            <Head title={t("who_we_are")} />

            <Grid
                container
                flexDirection="row"
                alignContent="center"
                color="primary.contrastText"
                justifyContent="center"
                sx={{ mb: 3 }}
            >
                <Grid size={{ xs: 12, md: 4 }} sx={{ bgcolor: "primary.main", p: 2 }}>
                    <Typography variant="h2">{t("we_are_parishes")}</Typography>

                    <Box sx={{ ml: 5, mt: 3 }}>
                        <Typography
                            sx={{ fontSize: "1.8rem", display: "flex", fontWeight: 800 }}
                            alignItems="center"
                        >
                            <ChurchIcon sx={{ fontSize: "3rem", mr: 3 }} fontSize="inherit" />{" "}
                            {t("number_of_parishes", { number: 288 })}
                        </Typography>

                        <Typography
                            sx={{ mt: 3, fontSize: "1.8rem", display: "flex", fontWeight: 800 }}
                            alignItems="center"
                        >
                            <ChurchIcon sx={{ fontSize: "3rem", mr: 3 }} fontSize="inherit" />{" "}
                            {t("number_of_missions_and_chapels", { number: 30 })}
                        </Typography>

                        <Typography
                            sx={{ mt: 3, fontSize: "1.8rem", display: "flex", fontWeight: 800 }}
                            alignItems="center"
                        >
                            <ChurchIcon sx={{ fontSize: "3rem", mr: 3 }} fontSize="inherit" />{" "}
                            {t("number_of_eastern_rite_catholic_churches", { number: 16 })}
                        </Typography>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }} sx={{ bgcolor: "secondary.main", p: 2 }}>
                    <Typography variant="h2">{t("we_are_schools")}</Typography>

                    <Box sx={{ ml: 5, mt: 3 }}>
                        <Typography
                            sx={{ fontSize: "1.8rem", display: "flex", fontWeight: 800 }}
                            alignItems="center"
                        >
                            <HistoryEduIcon sx={{ fontSize: "3rem", mr: 3 }} fontSize="inherit" />{" "}
                            {t("number_of_elementary_schools", { number: 214 })}
                        </Typography>

                        <Typography
                            sx={{ mt: 3, fontSize: "1.8rem", display: "flex", fontWeight: 800 }}
                            alignItems="center"
                        >
                            <SchoolIcon sx={{ fontSize: "3rem", mr: 3 }} fontSize="inherit" />{" "}
                            {t("number_of_high_schools", { number: 51 })}
                        </Typography>

                        <Typography
                            sx={{ mt: 3, fontSize: "1.8rem", display: "flex", fontWeight: 800 }}
                            alignItems="center"
                        >
                            <SchoolIcon sx={{ fontSize: "3rem", mr: 3 }} fontSize="inherit" />{" "}
                            {t("number_of_students_enrolled", { number: "73 750+" })}
                        </Typography>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }} sx={{ bgcolor: "#8B0577", p: 2 }}>
                    <Typography variant="h2">{t("we_are_community")}</Typography>

                    <Box sx={{ ml: 5, mt: 3 }}>
                        <Typography
                            sx={{ fontSize: "1.8rem", display: "flex", fontWeight: 800 }}
                            alignItems="center"
                        >
                            <FamilyRestroomIcon
                                sx={{ fontSize: "3rem", mr: 3 }}
                                fontSize="inherit"
                            />{" "}
                            {t("number_of_catholics", { number: "4 349 267" })}
                        </Typography>

                        <Typography
                            sx={{ mt: 3, fontSize: "1.8rem", display: "flex", fontWeight: 800 }}
                            alignItems="center"
                        >
                            <LocationCityIcon sx={{ fontSize: "3rem", mr: 3 }} fontSize="inherit" />{" "}
                            {t("number_of_catholic_cities", { number: 120 })}
                        </Typography>

                        <Typography
                            sx={{ mt: 3, fontSize: "1.8rem", display: "flex", fontWeight: 800 }}
                            alignItems="center"
                        >
                            <LanguageIcon sx={{ fontSize: "3rem", mr: 3 }} fontSize="inherit" />{" "}
                            {t("number_of_mass_languages", { number: 42 })}
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            <Container sx={{ mt: 15, mb: 15 }}>
                <Typography id="mission" component="h2" variant="h2" sx={{ mb: 3 }}>
                    {t("ls_catholics_mission")}
                </Typography>
                <Typography variant="body1" sx={{ margin: "0 0 1.5em" }}>
                    {t("ls_catholics_mission_paragraph1")}
                </Typography>

                <Typography variant="body1">{t("ls_catholics_mission_paragraph2")}</Typography>

                <Typography id="history" component="h2" variant="h2" sx={{ mt: 10, mb: 3 }}>
                    {t("our_history")}
                </Typography>

                <Typography variant="body1" sx={{ margin: "0 0 1.5em" }}>
                    {t("our_history_paragraph1")}
                </Typography>
                <Typography variant="body1" sx={{ margin: "0 0 1.5em" }}>
                    {t("our_history_paragraph2")}
                </Typography>
                <Typography variant="body1" sx={{ margin: "0 0 1.5em" }}>
                    {t("our_history_paragraph3")}
                </Typography>
                <Typography variant="body1" sx={{ margin: "0 0 1.5em" }}>
                    {t("our_history_paragraph4")}
                </Typography>
                <Typography variant="body1" sx={{ margin: "0 0 1.5em" }}>
                    {t("our_history_paragraph5")}
                </Typography>
            </Container>
        </MainLayout>
    );
}
