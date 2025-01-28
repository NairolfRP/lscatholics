import type { Education } from "@/features/applications/types/applications";
import { useTranslation } from "@/hooks/use_translation";
import AddIcon from "@mui/icons-material/Add";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import FormControl from "@mui/material/FormControl";
import Grid from "@mui/material/Grid2";
import IconButton from "@mui/material/IconButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import TextField from "@mui/material/TextField";

const schoolLevel = [
    "associate_degree",
    "bachelor_degree",
    "master_degree",
    "doctorate",
    "juris_doctor",
    "doctor_of_medicine",
    "doctor_of_dental_surgery",
    "doctor_of_pharmacy",
    "master_of_business_administration",
];

const maxOfEducationFields = 3;

export default function EducationField({
    data,
    setData,
}: {
    data: Education[];
    setData: (v: Education[]) => void;
}) {
    const { t } = useTranslation();

    const hasMaxLength = data.length >= maxOfEducationFields;

    const handleAddClick = () => {
        if (hasMaxLength) return;

        setData([
            ...data,
            {
                degree: "",
                name: "",
                year: "",
                major: "",
            },
        ]);
    };

    const handleRemoveClick = (dataID: number) => {
        const newData = data.filter((_, i) => i !== dataID);

        setData(newData);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>,
        dataID: number,
        key: string,
    ) => {
        const newData = data.map((d, i) => {
            if (i !== dataID || !(key in d)) {
                return d;
            }

            return {
                ...d,
                [key]: e.target.value,
            };
        });

        setData(newData);
    };

    return (
        <>
            {data.map((d, index) => (
                <Grid key={index} container spacing={2} alignItems="center" sx={{ mb: 2 }}>
                    <Grid size={{ md: 2 }}>
                        <FormControl required fullWidth>
                            <InputLabel id="school_degree_label">{t("school_degree")}</InputLabel>
                            <Select
                                labelId="school_degree_label"
                                label={t("school_degree")}
                                displayEmpty
                                value={d.degree}
                                onChange={(e) => handleChange(e, index, "degree")}
                            >
                                {schoolLevel.map((option, optionID) => (
                                    <MenuItem key={optionID} value={option}>
                                        {t(option)}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid>
                        <TextField
                            required
                            name="school_name"
                            value={d.name}
                            placeholder="Harvard University"
                            label={t("school_name")}
                            onChange={(e) => handleChange(e, index, "name")}
                        />
                    </Grid>
                    <Grid size={{ md: 2 }}>
                        <TextField
                            required
                            name="school_graduation_year"
                            value={d.year}
                            type="number"
                            placeholder="2020"
                            label={t("school_graduation_year")}
                            onChange={(e) => handleChange(e, index, "year")}
                        />
                    </Grid>
                    <Grid>
                        <TextField
                            required
                            name="school_major"
                            value={d.major}
                            placeholder="Administration"
                            label={t("school_major")}
                            onChange={(e) => handleChange(e, index, "major")}
                        />
                    </Grid>
                    <Grid>
                        <IconButton
                            color="error"
                            aria-label="remove school"
                            onClick={() => handleRemoveClick(index)}
                        >
                            <RemoveCircleIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            ))}
            <Grid container spacing={2} alignItems="center">
                <Grid>
                    <IconButton
                        color="primary"
                        aria-label="add school"
                        onClick={handleAddClick}
                        disabled={hasMaxLength}
                    >
                        <AddIcon />
                    </IconButton>
                </Grid>
            </Grid>
        </>
    );
}
