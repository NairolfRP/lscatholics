import NotificationService from "@/services/notification_service";
import type { Notification } from "@/types/notification";
import { usePage } from "@inertiajs/react";
import { useEffect } from "react";
import { SharedProps } from "@adonisjs/inertia/types";

export default function Notifications() {
    const { notification: flashNotification } = usePage<SharedProps>().props;

    useEffect(() => {
        const notification: Notification | undefined = flashNotification;

        if (notification) {
            const { message, variant } = notification;

            NotificationService({ message, variant });
        }
    }, [flashNotification]);

    return null;
}
