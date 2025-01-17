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
import { PageProps } from "@/types/pageProps";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Typography from "@mui/material/Typography";
import { useSnackbar } from "notistack";
import { type SyntheticEvent } from "react";

export default function DonationForm() {
    const { t } = useTranslation();
    const { form, setPaymentInProgress, isProcessing } = useDonateFormContext();
    const { enqueueSnackbar } = useSnackbar();
    const { openPopup, watchPopup } = usePaymentPopup();
    const { post, reset, hasErrors, data } = form;

    const handleSubmit = useEventCallback((e: SyntheticEvent) => {
        e.preventDefault();
        post("/donate", {
            preserveState: true,
            preserveScroll: true,
            onBefore: () => setPaymentInProgress(true),
            onSuccess: async (page: { props: PageProps }) => {
                const gatewayURL = page.props.fleecaGatewayURL as string;
                if (!gatewayURL) {
                    setPaymentInProgress(false);
                    throw Error("Fleeca Gateway URL missing.");
                }
                openPopup(gatewayURL);
                watchPopup(async () => {
                    try {
                        const result = await fetch("/donate/success").then((res) => res.json());
                        if (!result?.success)
                            throw new Error(result?.error || "Failed to process donation");
                        enqueueSnackbar(t("success_donation_notification"), {
                            variant: "success",
                            action: (snackbarKey) => (
                                <CloseSnackbarButton snackbarKey={snackbarKey} />
                            ),
                        });
                        reset();
                    } catch (e) {
                        enqueueSnackbar(`${e}`, {
                            persist: true,
                            variant: "error",
                            action: (snackbarKey) => (
                                <CloseSnackbarButton snackbarKey={snackbarKey} />
                            ),
                        });
                        //console.error(e);
                    } finally {
                        setPaymentInProgress(false);
                    }
                });
            },
            onError: () => {
                setPaymentInProgress(false);
                console.error("Error generating Fleeca Gateway URL");
            },
        });
    });

    return (
        <>
            <Typography component="h2" variant="h2" gutterBottom>
                {t("donation_amount")}
            </Typography>
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
                    startIcon={isProcessing && <CircularProgress color="inherit" />}
                    variant="contained"
                    sx={{ mt: 5 }}
                    disabled={isProcessing || hasErrors || !data.confirmation || data.amount <= 0}
                >
                    {isProcessing ? t("in_progress") : t("submit")}
                </Button>
            </Box>
        </>
    );
}
