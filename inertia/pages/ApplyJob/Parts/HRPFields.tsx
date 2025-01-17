import FormDivider from "@/components/common/FormDivider/FormDivider";
import Trans from "@/components/locales/Trans/Trans";
import { useEventCallback } from "@/hooks/useEventCallback";
import { useTranslation } from "@/hooks/useTranslation";
import { TextFieldChangeEventType } from "@/types/forms";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

interface HRPFieldsProps {
    discordID: string;
    oocMotivations: string;
    errors: {
        discordID: string | undefined;
        oocMotivations: string | undefined;
    };
    setData: (key: string, value: string) => void;
}

export default function HRPFields({ discordID, oocMotivations, errors, setData }: HRPFieldsProps) {
    const { t } = useTranslation();

    const handleChange = useEventCallback((e: TextFieldChangeEventType) => {
        setData(e.target.name, e.target.value);
    });

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                (( {t("ooc_section")} ))
            </Typography>

            <FormDivider />
            <TextField
                type="number"
                variant="filled"
                placeholder="12345678910111213"
                label={t("job_application_discord_id_question")}
                value={discordID}
                onChange={handleChange}
                sx={{ mb: 3 }}
                error={!!discordID}
                helperText={<Trans i18nKey="job_application_discord_id_question_helpertext" components={[<Link key="0" target="_blank"></Link>]} />}
                name="discordID"
            />

            <TextField
                fullWidth
                rows={5}
                multiline
                variant="filled"
                label={t("job_application_ooc_motivations_question")}
                value={oocMotivations}
                error={!!errors.oocMotivations}
                helperText={errors.oocMotivations}
                onChange={handleChange}
                name="oocMotivations"
            />
            <Typography variant="subtitle2">{t("job_application_ooc_motivations_question_placeholder")}</Typography>
        </Box>
    );
}
