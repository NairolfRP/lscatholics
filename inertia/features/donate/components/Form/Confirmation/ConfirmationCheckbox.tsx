import { useDonateFormContext } from "@/features/donate/hooks/useDonateFormContext";
import { useEventCallback } from "@/hooks/useEventCallback";
import { useTranslation } from "@/hooks/useTranslation";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { type SyntheticEvent } from "react";

export default function ConfirmationCheckbox() {
    const { t } = useTranslation();
    const { form, isProcessing } = useDonateFormContext();
    const { data, setData, forgetError, invalid, errors } = form;

    const handleChange = useEventCallback((_: SyntheticEvent, checked: boolean) => {
        if (checked && invalid("confirmation")) forgetError("confirmation");

        setData("confirmation", checked);
    });

    return (
        <FormControl
            disabled={isProcessing}
            required
            sx={{ display: "flex", flexWrap: "wrap" }}
            error={invalid("confirmation")}
        >
            <FormControlLabel
                checked={data.confirmation}
                onChange={handleChange}
                control={<Checkbox />}
                label={`(( ${t("confirmation_connected_to_fleeca")} ))`}
            />
            <FormHelperText>{invalid("confirmation") && errors.confirmation}</FormHelperText>
        </FormControl>
    );
}
