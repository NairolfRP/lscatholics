import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { ComponentPropsWithRef } from "react";

export function PhoneInput(props: ComponentPropsWithRef<typeof TextField>) {
    const { ref, slotProps, onChange, ...other } = props;

    return (
        <TextField
            {...other}
            ref={ref}
            slotProps={{
                ...slotProps,
                input: {
                    ...slotProps?.input,
                    startAdornment: (
                        <InputAdornment position="start">
                            <ContactPhoneIcon />
                        </InputAdornment>
                    ),
                },
                htmlInput: {
                    ...slotProps?.htmlInput,
                    maxLength: 8,
                    minLength: 3,
                    pattern: "[0-9]*",
                },
            }}
            onChange={(e) => {
                const value = e.target.value.replace(/[^0-9]/g, "");
                onChange?.({ ...e, target: { ...e.target, value } });
            }}
        />
    );
}
