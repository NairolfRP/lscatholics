import type { AMOUNT_SELECTOR_MODE_TYPE } from "@/features/donate/types/donate_form";
import { useEventCallback } from "@/hooks/useEventCallback";
import { useTranslation } from "@/hooks/useTranslation";
import { formatPrice } from "@/utils/helpers";
import BackspaceIcon from "@mui/icons-material/Backspace";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Collapse from "@mui/material/Collapse";
import FormHelperText from "@mui/material/FormHelperText";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { usePage } from "@inertiajs/react";
import type { SharedProps } from "@adonisjs/inertia/types";
import { usePaymentProcessing } from "@/features/donate/context/PaymentProcessingForm";
import { Controller, useFormContext } from "react-hook-form";

const defaultAmounts = [100000, 50000, 20000, 10000, 5000] as const;
const AMOUNT_MODE = { DEFAULT: 0, CUSTOM: 1 } as const;

export default function AmountField() {
    const { t } = useTranslation();
    const { errors = {} } = usePage<SharedProps>().props;
    const { isPaymentProcessing } = usePaymentProcessing();
    const { control, setValue, getValues } = useFormContext();
    const [amountMode, setAmountMode] = useState<AMOUNT_SELECTOR_MODE_TYPE>(AMOUNT_MODE.DEFAULT);

    const handleAmountChange = useEventCallback((v: number) => {
        if (amountMode === AMOUNT_MODE.DEFAULT && errors.amount) delete errors["amount"];
        const value = Math.max(1, Number(v) || 0);
        setValue("amount", value);
    });

    const handleAmountModeChange = useEventCallback((v: AMOUNT_SELECTOR_MODE_TYPE) => {
        setAmountMode(v);
    });

    return (
        <>
            <Collapse in={amountMode === AMOUNT_MODE.DEFAULT}>
                <ButtonGroup
                    color="info"
                    size="large"
                    variant="contained"
                    sx={{ display: "flex", flexWrap: "wrap" }}
                >
                    {defaultAmounts.map((amount, index) => (
                        <Button
                            key={index}
                            sx={{
                                fontWeight: 900,
                                m: 1,
                                p: 3,
                                borderBottom:
                                    getValues("amount") === amount ? "5px solid black" : null,
                            }}
                            onClick={() => handleAmountChange(amount)}
                            disabled={isPaymentProcessing || getValues("amount") === amount}
                        >
                            {formatPrice(amount)}
                        </Button>
                    ))}
                    <Button
                        sx={{ fontWeight: 900, p: 3, m: 1 }}
                        onClick={() => handleAmountModeChange(AMOUNT_MODE.CUSTOM)}
                        disabled={isPaymentProcessing || amountMode >= AMOUNT_MODE.CUSTOM}
                    >
                        {t("other")}
                    </Button>
                </ButtonGroup>
                <FormHelperText error={!!errors.amount}>{errors.amount}</FormHelperText>
            </Collapse>

            {amountMode >= AMOUNT_MODE.CUSTOM && (
                <Collapse in={amountMode >= AMOUNT_MODE.CUSTOM}>
                    <Stack direction="row" spacing={2}>
                        <Controller
                            name="amount"
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    type="number"
                                    slotProps={{
                                        input: {
                                            startAdornment: (
                                                <InputAdornment position="start">$</InputAdornment>
                                            ),
                                        },
                                    }}
                                    error={!!errors.amount}
                                    helperText={errors.amount}
                                    onChange={(e) =>
                                        field.onChange(Math.max(1, Number(e.target.value) || 0))
                                    }
                                    label={t("amount")}
                                    disabled={isPaymentProcessing}
                                    fullWidth
                                    required
                                />
                            )}
                        />
                        <IconButton
                            color="error"
                            onClick={() => handleAmountModeChange(AMOUNT_MODE.DEFAULT)}
                            disabled={isPaymentProcessing}
                        >
                            <BackspaceIcon />
                        </IconButton>
                    </Stack>
                </Collapse>
            )}
        </>
    );
}
