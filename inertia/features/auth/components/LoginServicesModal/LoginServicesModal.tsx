import LoginServiceButtons from "@/features/auth/components/LoginServiceButtons/LoginServiceButtons";
import { useTranslation } from "@/hooks/use_translation";
import Box from "@mui/material/Box";
//import Modal from "@mui/material/Modal";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import type { ComponentProps } from "react";

interface LoginServicesModalProps {
    id?: string;
    anchorEl: HTMLElement | null;
    open?: boolean;
    onClose?: ComponentProps<typeof Popover>["onClose"];
}

const modalStyles = {
    boxShadow: 24,
    p: 3,
};

export default function LoginServicesModal({
    id,
    anchorEl,
    open = false,
    onClose,
}: LoginServicesModalProps) {
    const { t } = useTranslation();

    return (
        <Popover
            sx={{ mt: 4 }}
            id={id}
            anchorEl={anchorEl}
            open={open}
            onClose={onClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "center" }}
        >
            <Box sx={modalStyles}>
                <Typography id="login-services-modal-title" variant="h4" component="h2">
                    {t("sign_in")}
                </Typography>
                <LoginServiceButtons />
            </Box>
        </Popover>
    );
}
