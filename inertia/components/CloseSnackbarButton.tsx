import { useEventCallback } from "@/hooks/use_event_callback";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import { useSnackbar } from "notistack";

export default function CloseSnackbarButton({ snackbarKey }: { snackbarKey: string | number }) {
    const { closeSnackbar } = useSnackbar();

    const handleClick = useEventCallback(() => closeSnackbar(snackbarKey));

    return (
        <IconButton aria-label="close" color="inherit" onClick={handleClick}>
            <DeleteIcon />
        </IconButton>
    );
}
