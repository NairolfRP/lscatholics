import { useEventCallback } from "@/hooks/useEventCallback";
import { useTranslation } from "@/hooks/useTranslation";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import { Head, useForm } from "@inertiajs/react";
import AlternateEmailIcon from "@mui/icons-material/AlternateEmail";
import CallIcon from "@mui/icons-material/Call";
import CheckIcon from "@mui/icons-material/Check";
import ErrorIcon from "@mui/icons-material/Error";
import NoteAltIcon from "@mui/icons-material/NoteAlt";
import { Stack } from "@mui/material";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useEffect, useState } from "react";

export default function Contact() {
    const { t } = useTranslation();

    const [success, displaySuccess] = useState<boolean>(false);

    const { data, setData, submit, processing, errors } = useForm({
        firstname: "",
        lastname: "",
        phone: "",
        message: "",
    });

    useEffect(() => {
        console.log(JSON.stringify(errors, null, 4));
    }, [errors]);

    const hasErrors = Object.keys(errors).length > 0;

    const handleChange = useEventCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const key = e.target.id;
        const value = e.target.value;
        setData((data) => ({
            ...data,
            [key]: value,
        }));
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        displaySuccess(false);

        submit("post", "/contact", {
            /*only: ["firstname", "lastname", "phone", "message"],*/
            preserveScroll: true,
            onSuccess: () => {
                displaySuccess(true);
            },
            onError: (e) => {
                console.log(e);
            },
        });
    };

    return (
        <MainLayout bannerTitle={t("contact_us")}>
            <Head title={t("contact_us")} />

            <Grid
                container
                flexDirection="row"
                alignContent="center"
                color="primary.contrastText"
                justifyContent="center"
                sx={{ mb: 3 }}
            >
                <Grid size={{ xs: 12, md: 4 }} sx={{ bgcolor: "primary.main", p: 2 }}>
                    <Typography variant="h2">{t("mail_address")}</Typography>

                    <Box sx={{ ml: 5, mt: 3 }}>
                        <Typography
                            sx={{ fontSize: "1.8rem", display: "flex", fontWeight: 800 }}
                            alignItems="center"
                        >
                            <NoteAltIcon sx={{ fontSize: "3rem", mr: 3 }} fontSize="inherit" />
                            Tour de la Cathédrale Notre-Dame-des-Saints
                            <br />
                            Ginger Street, Little Seoul
                            <br />
                            Los Santos, SA 90010
                        </Typography>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }} sx={{ bgcolor: "secondary.main", p: 2 }}>
                    <Typography variant="h2">{t("call_phone")}</Typography>

                    <Box sx={{ ml: 5, mt: 3 }}>
                        <Typography
                            sx={{ fontSize: "1.8rem", display: "flex", fontWeight: 800 }}
                            alignItems="center"
                        >
                            <CallIcon sx={{ fontSize: "3rem", mr: 3 }} fontSize="inherit" /> 700
                        </Typography>
                    </Box>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }} sx={{ bgcolor: "#8B0577", p: 2 }}>
                    <Typography variant="h2">{t("digital_email")}</Typography>

                    <Box sx={{ ml: 5, mt: 3 }}>
                        <Typography
                            sx={{ fontSize: "1.8rem", display: "flex", fontWeight: 800 }}
                            alignItems="center"
                        >
                            <AlternateEmailIcon
                                sx={{ fontSize: "3rem", mr: 3 }}
                                fontSize="inherit"
                            />{" "}
                            N/A
                        </Typography>
                    </Box>
                </Grid>
            </Grid>

            <Container sx={{ mt: 15, mb: 15 }}>
                <Typography gutterBottom sx={{ fontWeight: "bold" }}>
                    {t("contact_about_archbishop_or_archdiocese_title")}:
                </Typography>
                <Typography>{t("contact_about_archbishop_or_archdiocese_description")}</Typography>

                <Typography variant="h3" sx={{ mt: 10, mb: 5 }}>
                    {t("contact_form")}
                </Typography>

                <Box
                    component="form"
                    onSubmit={handleSubmit}
                    sx={{ "width": "65%", "& .MuiTextField-root": { mb: 3 } }}
                >
                    {success || hasErrors ? (
                        <Alert
                            icon={
                                success ? (
                                    <CheckIcon fontSize="inherit" />
                                ) : (
                                    <ErrorIcon fontSize="inherit" />
                                )
                            }
                            severity={success ? "success" : "error"}
                            sx={{ mb: 2 }}
                        >
                            {success ? t("contact_success_message") : t("form_error_message")}
                        </Alert>
                    ) : null}

                    <Stack direction="row" spacing={2}>
                        <TextField
                            id="firstname"
                            helperText={errors.firstname}
                            error={!!errors.firstname}
                            value={data.firstname}
                            onChange={handleChange}
                            label={t("firstname")}
                            variant="filled"
                            required
                            fullWidth
                        />
                        <TextField
                            id="lastname"
                            helperText={errors.lastname}
                            error={!!errors.lastname}
                            value={data.lastname}
                            onChange={handleChange}
                            label={t("lastname")}
                            variant="filled"
                            required
                            fullWidth
                        />
                    </Stack>
                    <TextField
                        id="phone"
                        helperText={errors.phone}
                        error={!!errors.phone}
                        value={data.phone}
                        onChange={handleChange}
                        label={t("phone")}
                        variant="filled"
                        required
                        fullWidth
                    />

                    <TextField
                        id="message"
                        helperText={errors.message}
                        error={!!errors.message}
                        value={data.message}
                        onChange={handleChange}
                        label={t("comments_or_question")}
                        multiline
                        rows={5}
                        variant="filled"
                        required
                        fullWidth
                    />

                    <Button type="submit" variant="contained" disabled={processing}>
                        {t("submit")}
                    </Button>
                </Box>
            </Container>
        </MainLayout>
    );
}
