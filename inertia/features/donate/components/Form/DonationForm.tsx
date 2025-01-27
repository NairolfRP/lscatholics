import CloseSnackbarButton from "@/components/CloseSnackbarButton";
import FormDivider from "@/components/common/FormDivider/FormDivider";
import AmountField from "@/features/donate/components/Form/Amount/AmountField";
import { AnonymousCheckbox } from "@/features/donate/components/Form/Anonymous/AnonymousCheckbox";
import ConfirmationCheckbox from "@/features/donate/components/Form/Confirmation/ConfirmationCheckbox";
import PersonalInfoFields from "@/features/donate/components/Form/PersonalInformation/PersonalInfoFields";
import { useDonateFormContext } from "@/features/donate/hooks/useDonateFormContext";
import { usePaymentPopup } from "@/features/donate/hooks/usePaymentPopup";
import { useEventCallback } from "@/hooks/useEventCallback";
import { useTranslation } from "@/hooks/useTranslation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import { type SyntheticEvent, useRef } from "react";
import { router, usePage } from "@inertiajs/react";
import type { SharedProps } from "@adonisjs/inertia/types";
import Alert from "@mui/material/Alert";
import type { Page } from "@inertiajs/core";

export default function DonationForm() {
    const { t } = useTranslation();
    const { errors, success } = usePage<SharedProps>().props;
    const { form, setPaymentInProgress, isProcessing } = useDonateFormContext();
    const { enqueueSnackbar } = useSnackbar();
    const { openPopup, watchPopup } = usePaymentPopup();
    const { post, reset, data, setData } = form;
    const alertRef = useRef<HTMLDivElement>(null);

    const handlePaymentError = (error?: any) => {
        router.post("/api/payment/cancel", undefined, {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                if (error) {
                    console.log(error);
                    enqueueSnackbar(`${error}`, {
                        persist: true,
                        variant: "error",
                        action: (snackbarKey) => <CloseSnackbarButton snackbarKey={snackbarKey} />,
                    });
                }
            },
            onError: () => {
                console.log("Failed to cancel the payment");
            },
        });
        setData("confirmation", false);
        setPaymentInProgress(false);
    };

    const handlePaymentSuccess = (page: Page) => {
        try {
            if (!page.props.success) {
                throw new Error("Failed to process donation");
            }

            enqueueSnackbar(t("success_donation_notification"), {
                variant: "success",
                action: (key) => <CloseSnackbarButton snackbarKey={key} />,
            });
            alertRef.current?.scrollIntoView();
            reset();
            setPaymentInProgress(false);
        } catch (e) {
            handlePaymentError();
        }
    };

    const handleSubmit = useEventCallback((e: SyntheticEvent) => {
        e.preventDefault();
        post("/donate", {
            preserveScroll: true,
            preserveState: true,
            onBefore: () => {
                setPaymentInProgress(true);
            },
            onSuccess: async (page) => {
                const gatewayURL = page.props.fleecaGatewayURL as string;
                try {
                    if (!gatewayURL) {
                        throw Error("Fleeca Gateway URL missing.");
                    }
                    openPopup(gatewayURL);
                    watchPopup(() => {
                        router.reload({
                            only: ["success"],
                            onSuccess: (p) => handlePaymentSuccess(p),
                        });
                    });
                } catch (e) {
                    alertRef.current?.scrollIntoView();
                    handlePaymentError(e);
                }
            },
            onError: (e) => {
                alertRef.current?.scrollIntoView();
                setData("confirmation", false);
                setPaymentInProgress(false);
                console.error("Error generating Fleeca Gateway URL:", e);
            },
        });
    });

    const isSubmitDisabled = isProcessing || !data.confirmation || data.amount <= 0;

    const alertMessage = success
        ? t("success_donation_notification")
        : errors?.errorMessage || t("error_submission");

    return (
        <>
            <Typography component="h2" variant="h2" gutterBottom>
                {t("donation_amount")}
            </Typography>
            {(success || !!errors) && (
                <Alert
                    ref={alertRef}
                    severity={success ? "success" : "error"}
                    variant="outlined"
                    sx={{ mb: 3 }}
                >
                    {alertMessage}
                </Alert>
            )}

            <AmountField />
            <FormDivider />

            <Box component="form" onSubmit={handleSubmit}>
                <PersonalInfoFields />
                <FormDivider />
                <AnonymousCheckbox />
                <FormDivider />
                <ConfirmationCheckbox />

                <Button
                    type="submit"
                    variant="contained"
                    disabled={isSubmitDisabled}
                    startIcon={isProcessing && <CircularProgress color="inherit" />}
                    sx={{ mt: 5 }}
                >
                    {isProcessing ? t("in_progress") : t("submit")}
                </Button>
            </Box>
        </>
    );
}
