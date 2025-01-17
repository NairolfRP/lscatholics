import type { HighSchool } from "@/features/applications/types/applications";
import { useTranslation } from "@/hooks/useTranslation";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";

const highSchoolDegree = ["diploma", "ged"];

export default function HighSchoolField({ data, setData }: { data: HighSchool; setData: (v: HighSchool) => void }) {
    const { t } = useTranslation();

    const handleHighSchoolChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>, key: string) => {
        if (!(key in data)) return;

        setData({
            ...data,
            [key]: e.target.value
        });
    };

    return (
        <Grid container spacing={2}>
            <Grid>
                <TextField
                    required={data.degree !== "none"}
                    name="high_school_name"
                    placeholder="Example High School"
                    label={t("high_school_name")}
                    value={data.name}
                    onChange={(e) => handleHighSchoolChange(e, "name")}
                />
            </Grid>
            <Grid size={{ md: 2 }}>
                <TextField
                    fullWidth
                    required={data.degree !== "none"}
                    name="high_school_graduation_year"
                    type="number"
                    placeholder="2020"
                    label={t("high_school_graduation_year")}
                    value={data.year}
                    onChange={(e) => handleHighSchoolChange(e, "year")}
                />
            </Grid>
            <Grid size={{ md: 2 }}>
                <FormControl required sx={{ width: "100%" }}>
                    <InputLabel id="high_school_degree_label">{t("high_school_degree")}</InputLabel>
                    <Select labelId="high_school_degree_label" label={t("high_school_degree")} value={data.degree} onChange={(e) => handleHighSchoolChange(e, "degree")}>
                        <MenuItem value="none">{t("none")}</MenuItem>
                        {highSchoolDegree.map((option, optionID) => (
                            <MenuItem key={optionID} value={option}>
                                {t(option)}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
            </Grid>
        </Grid>
    );
}
