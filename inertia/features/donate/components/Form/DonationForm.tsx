import CloseSnackbarButton from "@/components/CloseSnackbarButton";
import FormDivider from "@/components/common/FormDivider/FormDivider";
import AmountField from "@/features/donate/components/Form/Amount/AmountField";
import { AnonymousCheckbox } from "@/features/donate/components/Form/Anonymous/AnonymousCheckbox";
import ConfirmationCheckbox from "@/features/donate/components/Form/Confirmation/ConfirmationCheckbox";
import PersonalInfoFields from "@/features/donate/components/Form/PersonalInformation/PersonalInfoFields";
import { usePaymentPopup } from "@/features/donate/hooks/use_payment_popup";
import { useTranslation } from "@/hooks/use_translation";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import { useRef } from "react";
import { router, usePage } from "@inertiajs/react";
import type { SharedProps } from "@adonisjs/inertia/types";
import Alert from "@mui/material/Alert";
import type { Page } from "@inertiajs/core";
import { FormProvider, useForm, useFormContext } from "react-hook-form";
import { usePaymentProcessing } from "@/features/donate/context/PaymentProcessingForm";
import { formatPrice } from "@/utils/helpers";

function SubmitButton() {
    const { t } = useTranslation();
    const { watch } = useFormContext();
    const { isPaymentProcessing } = usePaymentProcessing();

    const [amount, confirmation] = watch(["amount", "confirmation"]);

    const isSubmitDisabled = isPaymentProcessing || !confirmation || amount <= 0;

    return (
        <Button
            type="submit"
            variant="contained"
            disabled={isSubmitDisabled}
            startIcon={isPaymentProcessing && <CircularProgress color="inherit" />}
            sx={{ mt: 5 }}
        >
            {isPaymentProcessing
                ? t("in_progress")
                : `${t("submit")}${amount && confirmation ? `: ${formatPrice(amount)}` : ""}`}
        </Button>
    );
}

export default function DonationForm() {
    const { t } = useTranslation();
    const { errors, success } = usePage<SharedProps>().props;
    const methods = useForm({
        defaultValues: {
            firstname: "",
            lastname: "",
            age: "",
            phone: "",
            organization: "",
            anonymous: false,
            amount: 0,
            confirmation: false,
        },
    });
    const { setPaymentInProgress } = usePaymentProcessing();
    const { enqueueSnackbar } = useSnackbar();
    const { openPopup, watchPopup } = usePaymentPopup();
    const alertRef = useRef<HTMLDivElement>(null);

    const { handleSubmit, reset, resetField } = methods;

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
        resetField("confirmation");
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

    const onSubmit = handleSubmit((data) => {
        router.post("/donate", data, {
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
                resetField("confirmation");
                setPaymentInProgress(false);
                console.error("Error generating Fleeca Gateway URL:", e);
            },
        });
    });

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

            <FormProvider {...methods}>
                <Box component="form" onSubmit={onSubmit}>
                    <AmountField />
                    <FormDivider />

                    <PersonalInfoFields />
                    <FormDivider />
                    <AnonymousCheckbox />
                    <FormDivider />
                    <ConfirmationCheckbox />

                    <SubmitButton />
                </Box>
            </FormProvider>
        </>
    );
}
