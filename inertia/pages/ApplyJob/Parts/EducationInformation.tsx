import FormDivider from "@/components/common/FormDivider/FormDivider";
import type {
    Education,
    HighSchool,
    JobApplicationFormSubmission,
} from "@/features/applications/types/applications";
import { useEventCallback } from "@/hooks/use_event_callback";
import { useTranslation } from "@/hooks/use_translation";
import EducationField from "@/pages/ApplyJob/Parts/EducationField";
import HighSchoolField from "@/pages/ApplyJob/Parts/HighSchoolField";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

export default function EducationInformation({
    data,
    setData,
}: {
    data: JobApplicationFormSubmission;
    setData: <K extends keyof JobApplicationFormSubmission>(
        key: K,
        value: JobApplicationFormSubmission[K],
    ) => void;
}) {
    const { t } = useTranslation();

    const handleChange = useEventCallback(
        (key: "highSchool" | "education", value: HighSchool | Education[]) => setData(key, value),
    );

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                {t("education")}
            </Typography>

            <FormDivider />

            <Typography variant="h5" gutterBottom>
                {t("high_school")}
            </Typography>
            <HighSchoolField
                data={data.highSchool}
                setData={(v: HighSchool) => handleChange("highSchool", v)}
            />

            <FormDivider />

            <Typography variant="h5" gutterBottom>
                {t("university_and_other")}
            </Typography>
            <EducationField data={data.education} setData={(v) => handleChange("education", v)} />
        </Box>
    );
}
