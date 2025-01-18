import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import { ComponentProps } from "react";
import { useTranslation } from "@/hooks/useTranslation";

interface YesNoRadioFormProps {
    required?: boolean;
    label: string;
    name?: string;
    value?: "yes" | "no";
    onChange?: ComponentProps<typeof RadioGroup>["onChange"];
    error?: boolean;
    errorMessage?: string;
}

export default function YesNoRadioForm({
    required = false,
    label,
    name,
    value,
    onChange,
    error = false,
    errorMessage,
}: YesNoRadioFormProps) {
    const { t } = useTranslation();

    const labelID = `${name}-label`;

    return (
        <FormControl required={required} error={error}>
            <FormLabel id={labelID}>{t(label)}</FormLabel>
            {error ? <FormHelperText>{errorMessage}</FormHelperText> : null}
            <RadioGroup aria-labelledby={labelID} name={name} value={value} onChange={onChange}>
                <FormControlLabel
                    value="yes"
                    control={<Radio required={required} />}
                    label={t("yes")}
                />
                <FormControlLabel
                    value="no"
                    control={<Radio required={required} />}
                    label={t("no")}
                />
            </RadioGroup>
        </FormControl>
    );
}
