import { useDonateFormContext } from "@/features/donate/hooks/useDonateFormContext";
import { useEventCallback } from "@/hooks/useEventCallback";
import { useTranslation } from "@/hooks/useTranslation";
import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import { SyntheticEvent } from "react";

export const AnonymousCheckbox = () => {
    const { t } = useTranslation();
    const { form, isProcessing } = useDonateFormContext();
    const { setData, data, errors } = form;

    const handleAnonymousChange = useEventCallback((_: SyntheticEvent, state: boolean) => {
        setData("anonymous", state);
    });

    return (
        <FormControl
            error={!!errors.anonymous}
            disabled={isProcessing}
            sx={{ display: "flex", flexWrap: "wrap" }}
        >
            <FormControlLabel
                name="anonymous"
                checked={data.anonymous}
                onChange={handleAnonymousChange}
                control={<Checkbox />}
                label={t("anonymous_donation")}
            />
            <FormHelperText>{errors.anonymous}</FormHelperText>
        </FormControl>
    );
};
