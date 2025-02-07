import InputAdornment from "@mui/material/InputAdornment";
import AccountCircle from "@mui/icons-material/AccountCircle";
import TextField from "@mui/material/TextField";
import type { ComponentPropsWithRef } from "react";
import { useTranslation } from "@/hooks/use_translation";

export default function NameInput(
    props: ComponentPropsWithRef<typeof TextField> & { fieldType: "firstname" | "lastname" },
) {
    const { t } = useTranslation();
    const {
        fieldType,
        ref,
        slotProps,
        label = fieldType === "firstname" ? t("firstname") : t("lastname"),
        ...other
    } = props;

    return (
        <TextField
            {...other}
            ref={ref}
            label={label}
            slotProps={{
                ...slotProps,
                input: {
                    ...slotProps?.input,
                    startAdornment: (
                        <InputAdornment position="start">
                            <AccountCircle />
                        </InputAdornment>
                    ),
                },
                htmlInput: {
                    ...slotProps?.htmlInput,
                    maxLength: 50,
                    minLength: 2,
                },
            }}
        />
    );
}
