import type { Notification } from "@/types/notification";
import { enqueueSnackbar } from "notistack";

export default function NotificationService({ message, variant }: Notification) {
    return enqueueSnackbar(message, { variant });
}
