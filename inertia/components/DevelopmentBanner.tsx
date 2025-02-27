import { type SyntheticEvent, useState } from "react";
import { useEventCallback } from "@/hooks/use_event_callback";
import Snackbar, { type SnackbarCloseReason } from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import Trans from "@/components/locales/Trans/Trans";
import Link from "./common/Link/Link";

export default function DevelopmentBanner() {
    const [open, setOpen] = useState(true);

    const handleClose = useEventCallback(
        (_?: SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
            if (reason === "clickaway") {
                return;
            }

            setOpen(false);
        },
    );

    return (
        <Snackbar
            open={open}
            onClose={handleClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
            <Alert severity="info" onClose={handleClose} variant="standard" sx={{ width: "100%" }}>
                <Trans
                    i18nKey="in_development_notice"
                    // @ts-ignore
                    components={[<strong></strong>, <Link target="_blank"></Link>]}
                />
            </Alert>
        </Snackbar>
    );
}
