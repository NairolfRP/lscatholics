import type { Notification } from "@/types/notification";
import { enqueueSnackbar } from "notistack";

export default function NotificationService({ message, variant, action }: Notification) {
    return enqueueSnackbar(message, { variant, action });
}
