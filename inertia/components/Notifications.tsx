import NotificationService from "@/services/notification_service";
import type { Notification } from "@/types/notification";
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import type { SharedProps } from "@adonisjs/inertia/types";
import IconButton from "@mui/material/IconButton";
import { closeSnackbar } from "notistack";
import CloseIcon from "@mui/icons-material/Close";

const action: Notification["action"] = (snackbarId) => (
    <IconButton onClick={() => closeSnackbar(snackbarId)}>
        <CloseIcon />
    </IconButton>
);

export default function Notifications() {
    const { notification: flashNotification } = usePage<SharedProps>().props;

    useEffect(() => {
        const notification: Notification | undefined = flashNotification;

        if (notification) {
            const { message, variant } = notification;

            NotificationService({ message, variant, action });
        }
    }, [flashNotification]);

    return null;
}
