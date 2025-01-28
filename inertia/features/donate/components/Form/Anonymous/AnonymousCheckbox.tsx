import { useTranslation } from "@/hooks/useTranslation";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { usePaymentProcessing } from "@/features/donate/context/PaymentProcessingForm";
import { Controller, useFormContext } from "react-hook-form";
import { usePage } from "@inertiajs/react";
import type { SharedProps } from "@adonisjs/inertia/types";

export const AnonymousCheckbox = () => {
    const { t } = useTranslation();
    const { errors = {} } = usePage<SharedProps>().props;
    const { isPaymentProcessing } = usePaymentProcessing();
    const { control } = useFormContext();

    return (
        <FormControl
            error={!!errors.anonymous}
            disabled={isPaymentProcessing}
            sx={{ display: "flex", flexWrap: "wrap" }}
        >
            <FormControlLabel
                control={
                    <Controller
                        name="anonymous"
                        control={control}
                        render={({ field }) => (
                            <Checkbox
                                {...field}
                                checked={field.value}
                                onChange={(e) => field.onChange(e.target.checked)}
                            />
                        )}
                    />
                }
                label={t("anonymous_donation")}
            />
            <FormHelperText>{errors.anonymous}</FormHelperText>
        </FormControl>
    );
};
