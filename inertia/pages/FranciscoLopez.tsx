import ArchbishopPageBanner from "@/assets/images/2f2d2f558c6a852a0c3f910222b328e9.jpg";
import OfficialPortrait from "@/assets/images/francisco_lopez_official_portrait.png";
import { FacebrowserIcon } from "@/components/icons/Facebrowser/FacebrowserIcon";
import Trans from "@/components/locales/Trans/Trans";
import { useTranslation } from "@/hooks/use_translation";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import { Head } from "@inertiajs/react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";
import IconButton from "@mui/material/IconButton";

const biographyNbOfParagraphs = 7;
const archbishopLopezTranslationKey = "archbishop_lopez";

export default function FranciscoLopez() {
    const { t } = useTranslation();

    const biographyParagraphs = useMemo(() => {
        const paragraphsList: string[] = [];

        for (let i = 0; i < biographyNbOfParagraphs; i++) {
            const nb = i + 1;
            paragraphsList.push(t(`${archbishopLopezTranslationKey}_biography_paragraph${nb}`));
        }

        return paragraphsList;
    }, [t]);

    return (
        <MainLayout bannerTitle={t("archbishop_lopez")} bannerImg={ArchbishopPageBanner}>
            <Head title={t(archbishopLopezTranslationKey)} />

            <Container sx={{ mt: 5, mb: 5 }}>
                <Typography variant="h2" sx={{ mb: 5 }}>
                    {t(archbishopLopezTranslationKey)}
                </Typography>
                <Grid container spacing={5}>
                    <Grid size={{ md: 4 }}>
                        <Box
                            component="img"
                            sx={{ width: { xs: "30vw", lg: "23rem" } }}
                            src={OfficialPortrait}
                        ></Box>
                    </Grid>
                    <Grid size={{ md: 8 }}>
                        {biographyParagraphs.map((paragraph, key) => (
                            <Typography key={key} component="p" sx={{ margin: "0 0 1.5em" }}>
                                {paragraph}
                            </Typography>
                        ))}
                        <Typography component="h3" variant="h4" sx={{ mt: 3 }}>
                            {t("follow_achbishop_emeritus_on_social")}:
                        </Typography>
                        <Trans
                            i18nKey="follow_archbishoplopez_on_facebrowser"
                            components={{
                                Icon: (
                                    <FacebrowserIcon fontSize="large" sx={{ color: "#B81C20" }} />
                                ),
                                Link: <IconButton component="a" target="_blank"></IconButton>,
                            }}
                        />
                    </Grid>
                </Grid>
            </Container>
        </MainLayout>
    );
}
