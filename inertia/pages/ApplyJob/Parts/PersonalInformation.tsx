import FormDivider from "@/components/common/FormDivider/FormDivider";
import YesNoRadioForm from "@/components/common/YesNoRadioForm/YesNoRadioForm";
import type { JobApplicationFormSubmission } from "@/features/applications/types/applications";
import { useEventCallback } from "@/hooks/useEventCallback";
import { useTranslation } from "@/hooks/useTranslation";
import IBANField from "@/pages/ApplyJob/Parts/IBANField";
import {
    SelectFieldChangeEventType,
    TextFieldChangeEvent,
    TextFieldChangeEventType,
} from "@/types/forms";
import { gta5Areas } from "@/utils/gta5Areas";
import AccountCircle from "@mui/icons-material/AccountCircle";
import ContactPhoneIcon from "@mui/icons-material/ContactPhone";
import HomeIcon from "@mui/icons-material/Home";
import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useMemo } from "react";

const applyingForOptions = ["full_time", "part_time", "temporary"];

export default function PersonalInformation({
    data,
    errors,
    setError,
    setData,
}: {
    data: JobApplicationFormSubmission;
    errors: Record<string, string>;
    setError: <K extends keyof JobApplicationFormSubmission>(key: K, value: string) => void;
    setData: <K extends keyof JobApplicationFormSubmission>(
        key: K,
        value: JobApplicationFormSubmission[K],
    ) => void;
}) {
    const { t } = useTranslation();

    const sortedGTA5Areas = useMemo(() => [...gta5Areas].sort(), []);

    const handleChange = useEventCallback(
        (e: TextFieldChangeEventType | SelectFieldChangeEventType) => {
            setData(e.target.name as keyof JobApplicationFormSubmission, e.target.value);
        },
    );

    const handleIBANChange = useEventCallback((v: string) => setData("iban", v));

    const handleIBANError = useEventCallback((v: string) => setError("iban", v));

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                {t("job_application_form_personal_information")}
            </Typography>
            <FormDivider />
            <Grid container spacing={2} alignItems="center">
                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField
                            required
                            name="firstname"
                            placeholder="John"
                            label={t("firstname")}
                            value={data.firstname}
                            error={!!errors.firstname}
                            helperText={errors.firstname}
                            onChange={handleChange as TextFieldChangeEvent}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField
                            required
                            name="lastname"
                            placeholder="Doe"
                            label={t("lastname")}
                            value={data.lastname}
                            error={!!errors.lastname}
                            helperText={errors.lastname}
                            onChange={handleChange as TextFieldChangeEvent}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <AccountCircle />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField
                            required
                            name="phone"
                            placeholder="700"
                            label={t("phone")}
                            value={data.phone}
                            error={!!errors.phone}
                            helperText={errors.phone}
                            onChange={handleChange as TextFieldChangeEvent}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <ContactPhoneIcon />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </Grid>
                </Grid>

                <Grid container spacing={2}>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <TextField
                            required
                            name="address"
                            placeholder="123 Main Street"
                            label={t("address")}
                            value={data.address}
                            error={!!errors.address}
                            helperText={errors.address}
                            onChange={handleChange as TextFieldChangeEvent}
                            slotProps={{
                                input: {
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <HomeIcon />
                                        </InputAdornment>
                                    ),
                                },
                            }}
                        />
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <FormControl required fullWidth error={!!errors.area}>
                            <InputLabel id="area-label">{t("area")}</InputLabel>
                            <Select
                                name="area"
                                labelId="area-label"
                                label={t("area")}
                                value={data.area}
                                onChange={handleChange}
                                error={!!errors.area}
                            >
                                {sortedGTA5Areas.map((area, areaIndex) => (
                                    <MenuItem key={areaIndex} value={area}>
                                        {area}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid size={{ xs: 12, sm: 6, md: 4 }}>
                        <IBANField
                            value={data.iban}
                            setValue={handleIBANChange}
                            error={errors.iban}
                            setError={handleIBANError}
                        />
                    </Grid>
                </Grid>
            </Grid>

            <FormDivider />

            <Box sx={{ mb: 2 }}>
                <YesNoRadioForm
                    value={data.isAdult}
                    error={!!errors.isAdult}
                    errorMessage={errors.isAdult}
                    onChange={handleChange}
                    name="isAdult"
                    label="job_application_age_question"
                    required
                />
            </Box>

            <FormDivider />

            <Box>
                <YesNoRadioForm
                    label="job_application_eligibility_to_work_us_question"
                    value={data.canProofRightToWork}
                    error={!!errors.canProofRightToWork}
                    errorMessage={errors.canProofRightToWork}
                    onChange={handleChange}
                    name="canProofRightToWork"
                    required
                />
            </Box>

            <FormDivider />

            <Box>
                <YesNoRadioForm
                    label="job_application_driver_license_question"
                    value={data.hasDriverLicense}
                    error={!!errors.hasDriverLicense}
                    errorMessage={errors.hasDriverLicense}
                    onChange={handleChange}
                    name="hasDriverLicense"
                    required
                />
            </Box>

            <FormDivider />

            <Box>
                <YesNoRadioForm
                    label="job_application_auto_insurance_question_label"
                    value={data.hasInsurance}
                    error={!!errors.hasInsurance}
                    errorMessage={errors.hasInsurance}
                    onChange={handleChange}
                    name="hasInsurance"
                    required
                />
            </Box>

            <FormDivider />

            <Box>
                <FormControl required sx={{ width: "50%" }} error={!!errors.applyingFor}>
                    <InputLabel id="applying_for_label">
                        {t("job_application_applying_for_question")}
                    </InputLabel>
                    <Select
                        labelId="applying_for_label"
                        label={t("job_application_applying_for_question")}
                        value={data.applyingFor}
                        error={!!errors.applyingFor}
                        onChange={handleChange}
                        name="applyingFor"
                    >
                        {applyingForOptions.map((option, optionID) => (
                            <MenuItem key={optionID} value={option}>
                                {t(option)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Box>
        </Box>
    );
}
