import { useTranslation } from "@/hooks/use_translation";
import type { User } from "@/types/user";
import { useForm } from "@inertiajs/react";
import DeleteIcon from "@mui/icons-material/Delete";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { FormEventHandler, useRef, useState } from "react";

export default function DeleteUserForm({ user }: { user: User }) {
    const { t } = useTranslation();

    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const usernameInput = useRef<HTMLInputElement>(null);

    const {
        data,
        setData,
        delete: destroy,
        processing,
        reset,
        errors,
    } = useForm({
        username: "",
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const deleteUser: FormEventHandler = (e) => {
        e.preventDefault();

        destroy("/profile", {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => usernameInput.current?.focus(),
            onFinish: () => reset(),
        });
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);

        reset();
    };

    return (
        <Box component="section">
            <Box component="header">
                <Typography component="h2" variant="h3" gutterBottom>
                    {t("delete_account")}
                </Typography>

                <Typography component="p" sx={{ marginBottom: "16px" }}>
                    {t("delete_account_description")}
                </Typography>
            </Box>

            <Button
                variant="contained"
                color="error"
                startIcon={<DeleteIcon />}
                onClick={confirmUserDeletion}
            >
                {t("delete_account")}
            </Button>

            <Dialog
                open={confirmingUserDeletion}
                onClose={closeModal}
                PaperProps={{
                    component: "form",
                    onSubmit: deleteUser,
                }}
            >
                <DialogTitle>{t("dialog_delete_account_title")}</DialogTitle>

                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        {t("dialog_delete_account_text_1")}
                    </DialogContentText>
                    <DialogContentText fontWeight={700}>
                        {t("dialog_delete_account_text_2", { username: user.name })}
                    </DialogContentText>
                    <TextField
                        id="username"
                        name="username"
                        ref={usernameInput}
                        value={data.username}
                        onChange={(e) => setData("username", e.target.value)}
                        focused
                        error={!!errors.username}
                        helperText={errors.username}
                        fullWidth
                        variant="outlined"
                    />
                </DialogContent>

                <DialogActions>
                    <Button onClick={closeModal}>{t("cancel")}</Button>

                    <Button
                        type="submit"
                        variant="contained"
                        color="error"
                        disabled={processing || !data.username || data.username !== user.name}
                    >
                        {t("delete_account")}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
