import FormDivider from "@/components/common/FormDivider/FormDivider";
import {
    Education,
    EmploymentInformation,
    HighSchool,
    JobApplicationFormSubmission,
} from "@/features/applications/types/applications";
import { useEventCallback } from "@/hooks/useEventCallback";
import { useTranslation } from "@/hooks/useTranslation";
import ApplicantStatement from "@/pages/ApplyJob/Parts/ApplicantStatement";
import EducationInformation from "@/pages/ApplyJob/Parts/EducationInformation";
import HRPFields from "@/pages/ApplyJob/Parts/HRPFields";
import PersonalInformation from "@/pages/ApplyJob/Parts/PersonalInformation";
import ProfessionalExperienceField from "@/pages/ApplyJob/Parts/ProfessionalExperienceField";
import { YesNoRadioFormValue } from "@/types/forms";
import { useForm } from "@inertiajs/react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { SyntheticEvent } from "react";

export default function Form({ jobID }: { jobID: number }) {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors, setError } =
        useForm<JobApplicationFormSubmission>({
            firstname: "",
            lastname: "",
            phone: "",
            address: "",
            area: "",
            iban: "",
            isAdult: "" as YesNoRadioFormValue,
            canProofRightToWork: "" as YesNoRadioFormValue,
            hasDriverLicense: "" as YesNoRadioFormValue,
            hasInsurance: "" as YesNoRadioFormValue,
            applyingFor: "",
            highSchool: {
                name: "",
                year: "",
                degree: "none",
            } as HighSchool,
            education: [] as Education[],
            employmentInformation: [] as EmploymentInformation[],
            signature: "",
            discordID: "",
            oocMotivations: "",
        });

    const handleSubmit = useEventCallback((e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(`/apply/${jobID}`, {
            preserveScroll: true,
        });
    });

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Box>
                <PersonalInformation
                    data={data}
                    errors={errors}
                    setError={setError}
                    setData={setData}
                />

                <FormDivider />

                <EducationInformation data={data} setData={setData} />

                <FormDivider />

                <ProfessionalExperienceField
                    data={data.employmentInformation}
                    setData={(v) => setData("employmentInformation", v)}
                />

                <FormDivider />

                <ApplicantStatement
                    signature={data.signature}
                    error={errors.signature}
                    setSignature={(v) => setData("signature", v)}
                />

                <FormDivider />

                <HRPFields
                    discordID={data.discordID}
                    oocMotivations={data.oocMotivations}
                    errors={{ discordID: errors.discordID, oocMotivations: errors.oocMotivations }}
                    setData={setData}
                />

                <FormDivider />

                <Button type="submit" variant="contained" color="secondary" disabled={processing}>
                    {t("submit")}
                </Button>
            </Box>
        </Box>
    );
}
