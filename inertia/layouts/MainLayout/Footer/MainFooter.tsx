import { FacebrowserIcon } from "@/components/icons/Facebrowser/FacebrowserIcon";
import Link from "@/components/common/Link/Link";
import Trans from "@/components/locales/Trans/Trans";
import { useTranslation } from "@/hooks/useTranslation";
import { Button, Divider, ListItemButton, Stack, TextField } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";

const FooterH2 = ({ children, ...others }: React.ComponentPropsWithoutRef<typeof Typography>) => {
    return (
        <Typography variant="h2" fontWeight="500" color="primary" {...others}>
            {children}
        </Typography>
    );
};

const FooterLeftH2 = ({ children }: { children: React.ReactNode }) => {
    return <FooterH2 fontSize="2rem">{children}</FooterH2>;
};

const FooterRightH2 = ({ children }: { children: React.ReactNode }) => {
    return <FooterH2 fontSize="2.5rem">{children}</FooterH2>;
};

const FooterListLink = ({ href, label }: { href?: string; label: string }) => (
    <ListItemButton component={Link} href={href || ""}>
        {label}
    </ListItemButton>
);

export default function MainFooter() {
    const { t } = useTranslation();
    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            id="app-footer"
            sx={{
                width: "100vw",
                marginTop: "auto",
                borderTop: 10,
                borderColor: "secondary.main",
                pt: "1.8rem",
                pb: "1.8rem",
            }}
        >
            <Container maxWidth="xl">
                <Grid container spacing={2} sx={{ mb: 2 }} alignItems="center">
                    <Grid sx={{ flexGrow: 1 }}>
                        <Grid container spacing={10}>
                            <Grid>
                                <FooterLeftH2>{t("archdiocese")}</FooterLeftH2>
                                <List>
                                    <FooterListLink href="/about-us" label={t("who_we_are")} />
                                    <FooterListLink
                                        href="/archbishop"
                                        label={t("archbishop_lopez")}
                                    />
                                    <FooterListLink href="/departments" label={t("departments")} />
                                    <FooterListLink label={t("handbook")} />
                                    <FooterListLink label={t("directory")} />
                                    <FooterListLink label={t("contact_us")} href="/contact" />
                                </List>
                            </Grid>
                            <Grid>
                                <FooterLeftH2>{t("parishes")}</FooterLeftH2>
                                <List>
                                    <FooterListLink label={t("find_parish")} />
                                    <FooterListLink label={t("ethnic_liturgies")} />
                                    <FooterListLink label={t("parish_notices")} />
                                </List>
                            </Grid>
                            <Grid>
                                <FooterLeftH2>{t("careers")}</FooterLeftH2>
                                <List>
                                    <FooterListLink label={t("vocations")} />
                                    <FooterListLink label={t("human_ressources")} />
                                    <FooterListLink label={t("browse_jobs")} />
                                </List>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid>
                        <Box>
                            <FooterRightH2>{t("stay_connected")}</FooterRightH2>
                            <Typography>{t("signup_newsletter_description")}</Typography>
                            <Box component="form" sx={{ pt: 1 }}>
                                <Grid
                                    container
                                    spacing={1}
                                    alignItems="center"
                                    sx={{ pt: 2, pb: 3 }}
                                >
                                    <Grid sx={{ flexGrow: 1 }}>
                                        <TextField
                                            type="email"
                                            label="Your Email Address"
                                            fullWidth
                                        />
                                    </Grid>
                                    <Grid>
                                        <Button variant="contained" color="secondary">
                                            {t("submit")}
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Box>

                        <Box>
                            <FooterRightH2>{t("connect_with_ls_catholics")}</FooterRightH2>
                            <Stack direction="row" spacing={5}>
                                <IconButton
                                    target="_blank"
                                    href="https://facebrowser.gta.world/pages/LSCatholics"
                                    arial-label="Facebrowser"
                                >
                                    <FacebrowserIcon htmlColor="#B81C20" fontSize="large" />
                                </IconButton>
                            </Stack>
                        </Box>
                    </Grid>
                </Grid>
                <Divider />
                <Box id="app-copyright" fontSize="body2" sx={{ mt: 2, mb: 5 }}>
                    <Grid container>
                        <Grid sx={{ flexGrow: 1 }}>
                            <Typography variant="body2">
                                {t("footer_copyright", { year: currentYear })}
                            </Typography>
                        </Grid>
                        <Grid>
                            <Typography variant="body2">
                                (({" "}
                                <Trans
                                    i18nKey="developed_by_nairolf"
                                    values={{
                                        heart: "❤",
                                    }}
                                    components={[
                                        <span key="0" style={{ color: "#e25555" }}></span>,
                                        /* @ts-expect-error Link doesn't need href attribute here */
                                        <Link key="1" target="_blank"></Link>,
                                    ]}
                                />{" "}
                                ))
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                <Box id="app-fiction-notice">
                    <Alert severity="warning">
                        <Trans
                            i18nKey="footer_fiction_notice"
                            values={{ gtaw: t("gtaw") }}
                            /* @ts-expect-error Link doesn't need href attribute here */
                            components={[<Link key="0" target="_blank"></Link>]}
                        />{" "}
                        ))
                    </Alert>
                </Box>
            </Container>
        </Box>
    );
}
