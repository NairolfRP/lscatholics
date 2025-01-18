import FormDivider from "@/components/common/FormDivider/FormDivider";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import { useTranslation } from "@/hooks/useTranslation";

interface ApplicantStatementProps {
    signature: string;
    error: string | undefined;
    setSignature: (v: string) => void;
}

export default function ApplicantStatement({
    signature,
    error,
    setSignature,
}: ApplicantStatementProps) {
    const { t } = useTranslation();

    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                {t("applicants_statement")}
            </Typography>

            <FormDivider />
            <ul>
                <Typography component="li" gutterBottom>
                    {t("applicants_statement_1")}
                </Typography>
                <Typography component="li" gutterBottom>
                    {t("applicants_statement_2")}
                </Typography>
                <Typography component="li" gutterBottom>
                    {t("applicants_statement_3")}
                </Typography>
                <Typography component="li" gutterBottom>
                    {t("applicants_statement_4")}
                </Typography>
                <Typography component="li" gutterBottom>
                    {t("applicants_statement_5")}
                </Typography>
                <Typography component="li" gutterBottom>
                    {t("applicants_statement_6")}
                </Typography>
                <Typography component="li" gutterBottom>
                    {t("applicants_statement_7")}
                </Typography>
            </ul>

            <TextField
                required
                name="signature"
                variant="filled"
                label={t("signature")}
                value={signature}
                error={!!error}
                helperText={error}
                onChange={(e) => setSignature(e.target.value)}
            />
        </Box>
    );
}
