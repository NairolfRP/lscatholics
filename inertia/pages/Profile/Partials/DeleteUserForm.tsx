import { useTranslation } from "@/hooks/use_translation";
import { Controller, useForm } from "react-hook-form";
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
import { type Dispatch, type SetStateAction, useRef, useState } from "react";
import { useEventCallback } from "@mui/material";
import type { SharedProps } from "@adonisjs/inertia/types";
import { router, usePage } from "@inertiajs/react";

function DeleteModal({
    confirmingUserDeletion,
    setConfirmingUserDeletion,
}: {
    confirmingUserDeletion: boolean;
    setConfirmingUserDeletion: Dispatch<SetStateAction<boolean>>;
}) {
    const { t } = useTranslation();
    const { errors = {}, auth } = usePage<SharedProps>().props;
    const usernameInput = useRef<HTMLInputElement>(null);
    const {
        control,
        formState: { isSubmitting, isDirty, isValid },
        handleSubmit,
        reset,
    } = useForm({
        defaultValues: {
            username: "",
        },
    });

    const closeModal = useEventCallback(() => {
        setConfirmingUserDeletion(false);

        reset();
    });

    const deleteUser = handleSubmit((data) => {
        router.delete("/profile", {
            data,
            preserveScroll: true,
            onSuccess: () => closeModal(),
            onError: () => usernameInput.current?.focus(),
            onFinish: () => reset(),
        });
    });

    return (
        <Dialog
            open={confirmingUserDeletion}
            onClose={closeModal}
            slotProps={{
                paper: {
                    component: "form",
                    onSubmit: deleteUser,
                },
            }}
        >
            <DialogTitle>{t("dialog_delete_account_title")}</DialogTitle>

            <DialogContent>
                <DialogContentText sx={{ mb: 2 }}>
                    {t("dialog_delete_account_text_1")}
                </DialogContentText>
                <DialogContentText fontWeight={700}>
                    {t("dialog_delete_account_text_2", { username: auth!.user!.name })}
                </DialogContentText>
                <Controller
                    name="username"
                    rules={{ required: true, validate: (v) => v === auth!.user!.name }}
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            id="username"
                            ref={usernameInput}
                            focused
                            error={!!errors.username}
                            helperText={errors.username}
                            fullWidth
                            variant="outlined"
                        />
                    )}
                />
            </DialogContent>

            <DialogActions>
                <Button onClick={closeModal}>{t("cancel")}</Button>

                <Button
                    type="submit"
                    variant="contained"
                    color="error"
                    disabled={
                        isSubmitting || !isDirty || !isValid
                        /*!getValues("username") ||
                        getValues("username") !== auth!.user!.name*/
                    }
                >
                    {t("delete_account")}
                </Button>
            </DialogActions>
        </Dialog>
    );
}

export default function DeleteUserForm() {
    const { t } = useTranslation();
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
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

            <DeleteModal
                confirmingUserDeletion={confirmingUserDeletion}
                setConfirmingUserDeletion={setConfirmingUserDeletion}
            />
        </Box>
    );
}
