import { PhoneInput } from "@/components/common/PhoneInput/PhoneInput";
import type { DonatePropsForm } from "@/features/donate/types/donate_form";
import { useEventCallback } from "@/hooks/useEventCallback";
import { useTranslation } from "@/hooks/useTranslation";
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
import { type SyntheticEvent, useState } from "react";
import { usePaymentProcessing } from "@/features/donate/context/PaymentProcessingForm";
import { Controller, useFormContext } from "react-hook-form";
import { usePage } from "@inertiajs/react";
import type { SharedProps } from "@adonisjs/inertia/types";

interface PersonalInfoFieldsProps {
    data: Partial<DonatePropsForm>;
    errors: Partial<Record<keyof DonatePropsForm, string>>;
    setData: <K extends keyof DonatePropsForm>(field: K, value: DonatePropsForm[K]) => void;
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
    const { errors = {} } = usePage<SharedProps>().props;
    const { control } = useFormContext();
    const { isPaymentProcessing } = usePaymentProcessing();
    const [isOrganization, setIsOrganization] = useState(false);

    return (
        <>
            <OrganizationCheckbox
                isOrganization={isOrganization}
                setIsOrganization={setIsOrganization}
                disabled={isPaymentProcessing}
            />
            <Collapse in={isOrganization}>
                {isOrganization && (
                    <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                        <Controller
                            name="organization"
                            control={control}
                            rules={{ required: isOrganization }}
                            render={({ field }) => (
                                <TextField
                                    {...field}
                                    variant="filled"
                                    error={!!errors.organization}
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
                                    disabled={isPaymentProcessing}
                                    required={isOrganization}
                                />
                            )}
                        />
                    </Box>
                )}
            </Collapse>
        </>
    );
};

export default function PersonalInfoFields() {
    const { t } = useTranslation();
    const { errors = {} } = usePage<SharedProps>().props;
    const { control } = useFormContext();
    const { isPaymentProcessing } = usePaymentProcessing();

    return (
        <>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                {["lastname", "firstname"].map((f) => {
                    const fieldName = f as keyof DonatePropsForm;
                    return (
                        <Controller
                            key={f}
                            name={fieldName}
                            control={control}
                            rules={{ required: true }}
                            render={({ field }) => (
                                <TextField
                                    key={fieldName}
                                    {...field}
                                    variant="filled"
                                    error={!!errors[fieldName]}
                                    helperText={errors[fieldName]}
                                    label={t(fieldName)}
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
                                    disabled={isPaymentProcessing}
                                    required
                                />
                            )}
                        />
                    );
                })}
            </Box>
            <Box sx={{ display: "flex", flexWrap: "wrap" }}>
                <Controller
                    name="age"
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            variant="filled"
                            type="number"
                            onChange={(event) => field.onChange(+event.target.value)}
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
                            disabled={isPaymentProcessing}
                        />
                    )}
                />
                <Controller
                    name="phone"
                    control={control}
                    render={({ field }) => (
                        <PhoneInput
                            {...field}
                            variant="filled"
                            type="tel"
                            onChange={(event) => field.onChange(+event.target.value)}
                            error={!!errors.phone}
                            helperText={errors.phone}
                            label={t("phone")}
                            sx={{ m: 1 }}
                            disabled={isPaymentProcessing}
                        />
                    )}
                />
            </Box>
            <OrganizationField />
        </>
    );
}
