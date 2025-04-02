import { useEventCallback } from "@/hooks/use_event_callback";
import { router } from "@inertiajs/react";
import Button from "@mui/material/Button";
import { useSnackbar } from "notistack";
import GTAWLogo from "@/assets/images/gtaw-logo.png";
import Box from "@mui/material/Box";

export default function LoginServiceButtons() {
    const { enqueueSnackbar } = useSnackbar();

    const handleClick = useEventCallback((serviceName: string) => {
        const url = `/api/auth/${serviceName}/redirect`;

        const popupWidth = 500;
        const popupHeight = 600;
        const popupTop = window.screenY + (window.outerHeight - popupHeight) / 2.5;
        const popupLeft = window.screenX + (window.outerWidth - popupWidth) / 2;

        const popup = window.open(
            url,
            "oauth-popup",
            `width=${popupWidth},height=${popupHeight},top=${popupTop},left=${popupLeft}`,
        );

        if (!popup)
            return enqueueSnackbar("Veuillez autoriser les pop-ups pour continuer.", {
                variant: "warning",
            });

        const timer = setInterval(() => {
            if (popup && popup.closed) {
                clearInterval(timer);
                router.reload();
            }
        }, 1000);
    });

    return (
        <Button
            onClick={() => handleClick("gtaw")}
            id="gtaw-oauth"
            name="gtaw-oauth"
            fullWidth
            variant="contained"
            color="success"
            sx={{
                mt: 3,
                mb: 3,
                //"backgroundColor": bgColor,
                //"&:hover": { opacity: 0.95, backgroundColor: bgColor },
            }}
            startIcon={<Box component="img" height="20px" src={GTAWLogo}></Box>}
        >
            GTA World
        </Button>
    );
}
