import CreditCardIcon from "@mui/icons-material/CreditCard";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { useTranslation } from "@/hooks/useTranslation";

function validateIBAN(value: string): boolean {
    const ibanPattern = /^(0100|0200|0300) \d{4} \d$/;
    return ibanPattern.test(value);
}

export default function IBANField({ value, setValue, error, setError }: { value: string; setValue: (v: string) => void; error: string | undefined; setError: (v: string) => void }) {
    const { t } = useTranslation();

    const handleIBANChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const value = event.target.value.replace(/\s/g, "");

        if (!/^\d*$/.test(value)) return;

        const part1 = value.slice(0, 4);
        const part2 = value.slice(4, 8);
        const part3 = value.slice(8, 9);

        let formattedValue = part1;
        if (part2) formattedValue += " " + part2;
        if (part3) formattedValue += " " + part3;

        setValue(formattedValue);
        setError(!validateIBAN(formattedValue) ? "Format de l'IBAN invalide." : "");
    };

    return (
        <TextField
            required
            fullWidth
            name="iban"
            placeholder="0100 0000 0"
            label={t("iban")}
            value={value}
            onChange={(e) => handleIBANChange(e)}
            error={!!error}
            helperText={error}
            slotProps={{
                htmlInput: {
                    maxLength: 11
                },
                input: {
                    startAdornment: (
                        <InputAdornment position="start">
                            <CreditCardIcon />
                        </InputAdornment>
                    )
                }
            }}
        />
    );
}
