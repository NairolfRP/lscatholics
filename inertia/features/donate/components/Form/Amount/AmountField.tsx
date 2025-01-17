import { useDonateFormContext } from "@/features/donate/hooks/useDonateFormContext";
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

const defaultAmounts = [100000, 50000, 20000, 10000, 5000] as const;
const AMOUNT_MODE = { DEFAULT: 0, CUSTOM: 1 } as const;

export default function AmountField() {
    const { t } = useTranslation();
    const { form, isProcessing } = useDonateFormContext();
    const { data, setData, errors, validate, invalid, forgetError } = form;
    const [amountMode, setAmountMode] = useState<AMOUNT_SELECTOR_MODE_TYPE>(AMOUNT_MODE.DEFAULT);

    const handleAmountChange = useEventCallback((v: number) => {
        if (amountMode === AMOUNT_MODE.DEFAULT && errors.amount) forgetError("amount");
        const value = Math.max(1, Number(v) || 0);
        setData("amount", value);
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
                                borderBottom: data.amount === amount ? "5px solid black" : null,
                            }}
                            onClick={() => handleAmountChange(amount)}
                            disabled={isProcessing || data.amount === amount}
                        >
                            {formatPrice(amount)}
                        </Button>
                    ))}
                    <Button
                        sx={{ fontWeight: 900, p: 3, m: 1 }}
                        onClick={() => handleAmountModeChange(AMOUNT_MODE.CUSTOM)}
                        disabled={isProcessing || amountMode >= AMOUNT_MODE.CUSTOM}
                    >
                        {t("other")}
                    </Button>
                </ButtonGroup>
                <FormHelperText error={invalid("amount")}>{errors.amount}</FormHelperText>
            </Collapse>

            {amountMode >= AMOUNT_MODE.CUSTOM && (
                <Collapse in={amountMode >= AMOUNT_MODE.CUSTOM}>
                    <Stack direction="row" spacing={2}>
                        <TextField
                            type="number"
                            name="amount"
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">$</InputAdornment>
                                    ),
                                },
                            }}
                            value={data.amount}
                            error={invalid("amount")}
                            helperText={errors.amount}
                            onChange={(e) => handleAmountChange(Number(e.target.value))}
                            onBlur={() => validate("amount")}
                            label={t("amount")}
                            disabled={isProcessing}
                            fullWidth
                            required
                        />
                        <IconButton
                            color="error"
                            onClick={() => handleAmountModeChange(AMOUNT_MODE.DEFAULT)}
                            disabled={isProcessing}
                        >
                            <BackspaceIcon />
                        </IconButton>
                    </Stack>
                </Collapse>
            )}
        </>
    );
}
