import { useTranslation } from "@/hooks/use_translation";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { usePage } from "@inertiajs/react";
import type { SharedProps } from "@adonisjs/inertia/types";
import { usePaymentProcessing } from "@/features/donate/context/PaymentProcessingForm";
import { Controller, useFormContext } from "react-hook-form";

export default function ConfirmationCheckbox() {
    const { t } = useTranslation();
    const { errors = {} } = usePage<SharedProps>().props;
    const { isPaymentProcessing } = usePaymentProcessing();
    const { control } = useFormContext();

    return (
        <FormControl
            disabled={isPaymentProcessing}
            required
            sx={{ display: "flex", flexWrap: "wrap" }}
            error={!!errors.confirmation}
        >
            <FormControlLabel
                control={
                    <Controller
                        name="confirmation"
                        control={control}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <Checkbox
                                {...field}
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                            />
                        )}
                    />
                }
                label={`(( ${t("confirmation_connected_to_fleeca")} ))`}
            />
            <FormHelperText>{errors.confirmation}</FormHelperText>
        </FormControl>
    );
}
