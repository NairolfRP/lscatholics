import type { SnackbarAction } from "notistack";

export interface Notification {
    message: string;
    variant: "success" | "error" | "info" | "warning";
    action: SnackbarAction;
}
