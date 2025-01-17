import { PhoneInput } from "@/components/common/PhoneInput/PhoneInput";
import { useDonateFormContext } from "@/features/donate/hooks/useDonateFormContext";
import { DonatePropsForm, OneTimeDonationFormProps } from "@/features/donate/types/donate_form";
import { useEventCallback } from "@/hooks/useEventCallback";
import { useTranslation } from "@/hooks/useTranslation";
import { TextFieldChangeEventType } from "@/types/forms";
import AccountCircle from "@mui/icons-material/AccountCircle";
import BusinessIcon from "@mui/icons-material/Business";
import CakeIcon from "@mui/icons-material/Cake";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import InputAdornment from "@mui/material/InputAdornment";
import TextField from "@mui/material/TextField";
import { SyntheticEvent, useState } from "react";

interface PersonalInfoFieldsProps {
    data: Partial<DonatePropsForm>;
    errors: Partial<Record<keyof DonatePropsForm, string>>;
    setData: <K extends keyof DonatePropsForm>(field: K, value: DonatePropsForm[K]) => void;
    validate: OneTimeDonationFormProps["useForm"]["validate"];
    disabled: boolean;
}

const OrganizationCheckbox = ({
    isOrganization,
    setIsOrganization,
    disabled,
}: {
    isOrganization: boolean;
    setIsOrganization: (state: boolean) => void;
    disabled: PersonalInfoFieldsProps["disabled"];
}) => {
    const { t } = useTranslation();
    const handleIsOrganizationChange = useEventCallback((_: SyntheticEvent, checked: boolean) => {
        setIsOrganization(checked);
    });

    return (
        <FormControl sx={{ display: "flex", flexWrap: "wrap" }}>
            <FormControlLabel
                checked={isOrganization}
                control={<Checkbox />}
                label={t("donation_by_an_organization_or_company")}
                onChange={handleIsOrganizationChange}
                disabled={disabled}
            />
        </FormControl>
    );
};

const OrganizationField = () => {
    const { t } = useTranslation();
    const { form, isProcessing } = useDonateFormContext();
    const { data, setData, errors, validate, invalid } = form;
    const [isOrganization, setIsOrganization] = useState(false);

    const handleOrganizationNameChange = useEventCallback((e: TextFieldChangeEventType) => {
        setData("organization", e.target.value);
    });

    return (
        <>
            <OrganizationCheckbox
                isOrganization={isOrganization}
                setIsOrganization={setIsOrganization}
                disabled={isProcessing}
            />
            <Collapse in={isOrganization}>
                {isOrganization && (
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        <TextField
                            variant="filled"
                            name="organization"
                            onChange={handleOrganizationNameChange}
                            onBlur={() => validate("organization")}
                            value={data.organization}
                            error={invalid("organization")}
                            helperText={errors.organization}
                            label={t("organization_name")}
                            sx={{ m: 1 }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <BusinessIcon />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            disabled={isProcessing}
                            required={isOrganization}
                        />
                    </Box>
                )}
            </Collapse>
        </>
    );
};

export default function PersonalInfoFields() {
    const { t } = useTranslation();

    const { form, isProcessing } = useDonateFormContext();
    const { setData, data, validate, invalid, errors } = form;

    const handleTextFieldChange = useEventCallback(
        (field: keyof PersonalInfoFieldsProps["data"], value: string) => {
            setData(field, value);
        },
    );

    return (
        <>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                {["lastname", "firstname"].map((f) => {
                    const field = f as keyof DonatePropsForm;
                    return (
                        <TextField
                            key={field}
                            variant="filled"
                            name={field}
                            onChange={(e) => handleTextFieldChange(field, e.target.value)}
                            onBlur={() => validate(field)}
                            value={data[field]}
                            error={invalid(field)}
                            helperText={errors[field]}
                            label={t(field)}
                            sx={{ m: 1 }}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                            disabled={isProcessing}
                            required
                        />
                    );
                })}
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                <TextField
                    variant="filled"
                    type="number"
                    name="age"
                    onChange={(e) => handleTextFieldChange("age", e.target.value)}
                    onBlur={() => validate("age")}
                    value={data.age}
                    error={!!errors.age}
                    helperText={errors.age}
                    label={t("age")}
                    sx={{ m: 1 }}
                    slotProps={{
                        input: {
                            startAdornment: (
                                <InputAdornment position="start">
                                    <CakeIcon />
                                </InputAdornment>
                            ),
                        },
                    }}
                    disabled={isProcessing}
                />
                <PhoneInput
                    variant="filled"
                    type="tel"
                    name="phone"
                    onChange={(e) => handleTextFieldChange("phone", e.target.value)}
                    onBlur={() => validate("phone")}
                    value={data.phone}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    label={t("phone")}
                    sx={{ m: 1 }}
                    disabled={isProcessing}
                />
            </Box>
            <OrganizationField />
        </>
    );
}
