import FormDivider from "@/components/common/FormDivider/FormDivider";
import type { EmploymentInformation } from "@/features/applications/types/applications";
import { useTranslation } from "@/hooks/useTranslation";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import type { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

const maxFields = 3;

export default function ProfessionalExperienceField({ data, setData }: { data: EmploymentInformation[]; setData: (v: EmploymentInformation[]) => void }) {
    const { t } = useTranslation();

    const hasMaxLength = data.length >= maxFields;

    const handleAddClick = () => {
        if (hasMaxLength) return;

        setData([
            ...data,
            {
                companyName: "",
                position: "",
                duration: "",
                leavingReason: ""
            }
        ]);
    };

    const handleRemoveClick = (dataID: number) => {
        const newData = data.filter((_, i) => i !== dataID);

        setData(newData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>, dataID: number, key: string) => {
        const newData = data.map((d, i) => {
            if (i !== dataID || !(key in d)) {
                return d;
            }

            return {
                ...d,
                [key]: e.target.value
            };
        });

        setData(newData);
    };

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                {t("employment_information")}
            </Typography>

            <FormDivider />
            {data.map((d, index) => (
                <Grid key={index} container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid size={{ md: 2 }}>
                        <TextField required name="company_name" value={d.companyName} placeholder="" label={t("company_name")} onChange={(e) => handleChange(e, index, "companyName")} />
                    </Grid>
                    <Grid size={{ md: 2 }}>
                        <TextField required name="employment_position" value={d.position} placeholder="" label={t("employment_position")} onChange={(e) => handleChange(e, index, "position")} />
                    </Grid>
                    <Grid size={{ md: 2 }}>
                        <TextField
                            required
                            name="employment_duration"
                            value={d.duration}
                            placeholder="2 months"
                            label={t("employment_duration")}
                            onChange={(e) => handleChange(e, index, "duration")}
                        />
                    </Grid>
                    <Grid size={{ md: 2 }}>
                        <TextField required name="employment_leaving_reason" value={d.leavingReason} label={t("reason_for_leaving")} onChange={(e) => handleChange(e, index, "leavingReason")} />
                    </Grid>
                    <Grid>
                        <IconButton color="error" aria-label="remove employment information" onClick={() => handleRemoveClick(index)}>
                            <RemoveCircleIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}
            <Grid container spacing={2} alignItems="center">
                <Grid>
                    <IconButton color="primary" aria-label="add employment information" onClick={handleAddClick} disabled={hasMaxLength}>
                        <AddIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </Box>
    );
}
