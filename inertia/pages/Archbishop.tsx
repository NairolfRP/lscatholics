import ArchbishopPageBanner from "@/assets/images/2f2d2f558c6a852a0c3f910222b328e9.jpg";
import OfficialPortrait from "@/assets/images/francisco_lopez_official_portrait.png";
import { FacebrowserIcon } from "@/components/icons/Facebrowser/FacebrowserIcon";
import Trans from "@/components/locales/Trans/Trans";
import { useTranslation } from "@/hooks/useTranslation";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import { Head } from "@inertiajs/react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";

const biographyNbOfParagraphs = 6;

export default function Archbishop() {
    const { t } = useTranslation();

    const biographyParagraphs = useMemo(() => {
        const paragraphsList: string[] = [];

        for (let i = 0; i < biographyNbOfParagraphs; i++) {
            const nb = i + 1;
            paragraphsList.push(t(`archbishop_lopez_biography_paragraph${nb}`));
        }

        return paragraphsList;
    }, [t]);

    return (
        <MainLayout bannerTitle={t("archbishop_lopez")} bannerImg={ArchbishopPageBanner}>
            <Head title={t("archbishop_lopez")} />

            <Container sx={{ mt: 5, mb: 5 }}>
                <Typography variant="h2" sx={{ mb: 5 }}>
                    {t("archbishop_lopez")}
                </Typography>
                <Grid container spacing={5}>
                    <Grid size={{ xs: 4 }}>
                        <Box component="img" width="20rem" src={OfficialPortrait}></Box>
                    </Grid>
                    <Grid size={{ xs: 8 }}>
                        {biographyParagraphs.map((paragraph, key) => (
                            <Typography key={key} component="p" sx={{ margin: "0 0 1.5em" }}>
                                {paragraph}
                            </Typography>
                        ))}
                    </Grid>
                </Grid>
                <Typography component="h3" variant="h4" sx={{ mt: 3, mb: 3 }}>
                    {t("follow_achbishop_on_social")}:
                </Typography>
                <Trans
                    i18nKey="follow_archbishop_on_facebrowser"
                    components={{
                        Icon: <FacebrowserIcon fontSize="large" sx={{ color: "#B81C20" }} />,
                        Link: <Box component="a" target="_blank"></Box>,
                    }}
                />
            </Container>
        </MainLayout>
    );
}
