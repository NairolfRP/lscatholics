import LoginServiceButtons from "@/features/auth/components/LoginServiceButtons/LoginServiceButtons";
import { useTranslation } from "@/hooks/useTranslation";
import { Head, usePage } from "@inertiajs/react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ErrorIcon from "@mui/icons-material/Error";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function Login() {
    const { t } = useTranslation();
    const { errors } = usePage().props;

    return (
        <Container>
            <Head title={t("log_in")} />

            <Box
                sx={{
                    marginTop: 8,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                }}
            >
                <Typography component="h1" variant="h5">
                    {t("sign_in")}
                </Typography>
                {errors.auth && (
                    <Alert sx={{ mt: 3 }} icon={<ErrorIcon fontSize="inherit" />} severity="error">
                        {errors.auth}
                    </Alert>
                )}
                <Box sx={{ mt: 1 }}>
                    <LoginServiceButtons />
                </Box>
                <Button href="/" startIcon={<ArrowBackIcon />} disableRipple>
                    {t("back_home")}
                </Button>
            </Box>
        </Container>
    );
}
