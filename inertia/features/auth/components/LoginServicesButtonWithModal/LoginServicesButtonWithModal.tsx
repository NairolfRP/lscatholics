import LoginServicesModal from "@/features/auth/components/LoginServicesModal/LoginServicesModal";
import { useEventCallback } from "@/hooks/use_event_callback";
import { useTranslation } from "@/hooks/use_translation";
import LoginIcon from "@mui/icons-material/Login";
import Button from "@mui/material/Button";
import * as React from "react";

export default function LoginServicesButtonsWithModal() {
    const { t } = useTranslation();

    const [openModal, setOpenModal] = React.useState<boolean>(false);
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

    //const handleModalClose = useCallback(() => setOpenModal(false), []);

    const handleModalOpen = useEventCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
        setOpenModal((prevOpen) => !prevOpen);
    });

    const handleModalClose = useEventCallback(() => {
        setOpenModal(false);
    });

    return (
        <>
            <Button
                size="large"
                variant="text"
                color="inherit"
                sx={{ ml: 5 }}
                onClick={handleModalOpen}
                startIcon={<LoginIcon />}
            >
                {t("login")}
            </Button>
            <LoginServicesModal anchorEl={anchorEl} open={openModal} onClose={handleModalClose} />
        </>
    );
}
