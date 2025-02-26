import ArchbishopPageBanner from "@/assets/images/cardinal_callahan_armoiries.png";
import OfficialPortrait from "@/assets/images/portrait_cardinal_callahan.png";
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

const biographyNbOfParagraphs = 6;
const archbishopTranslationKey = "cardinal_callahan";

export default function Archbishop() {
    const { t } = useTranslation();

    const biographyParagraphs = useMemo(() => {
        const paragraphsList: string[] = [];

        for (let i = 0; i < biographyNbOfParagraphs; i++) {
            const nb = i + 1;
            paragraphsList.push(t(`${archbishopTranslationKey}_biography_paragraph${nb}`));
        }

        return paragraphsList;
    }, [t]);

    return (
        <MainLayout
            bannerTitle={t(archbishopTranslationKey)}
            bannerImg={ArchbishopPageBanner}
            bannerColor="#831F21"
        >
            <Head title={t(archbishopTranslationKey)} />

            <Container sx={{ mt: 5, mb: 5 }}>
                <Typography variant="h2" sx={{ mb: 5 }}>
                    {t(`${archbishopTranslationKey}_biography_title`)}
                </Typography>
                <Grid container spacing={5}>
                    <Grid size={{ md: 8 }}>
                        {biographyParagraphs.map((paragraph, key) => (
                            <Typography key={key} component="p" sx={{ margin: "0 0 1.5em" }}>
                                {paragraph}
                            </Typography>
                        ))}
                    </Grid>
                    <Grid size={{ md: 4 }}>
                        <Box
                            component="img"
                            sx={{ width: { md: "30vw", xs: "45vw" } }}
                            src={OfficialPortrait}
                        ></Box>
                        <Typography component="h3" variant="h5" sx={{ mt: 3 }}>
                            {t("follow_archbishop_on_social")}:
                        </Typography>
                        <Trans
                            i18nKey="follow_archbishop_on_facebrowser"
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
