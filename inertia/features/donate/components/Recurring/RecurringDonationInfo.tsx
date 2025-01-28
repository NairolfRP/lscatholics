import Trans from "@/components/locales/Trans/Trans";
import { useTranslation } from "@/hooks/useTranslation";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

const RECURRING_FIELDS = ["amount", "iban", "repeat_type", "start_date", "remarks"] as const;

export default function RecurringDonationInfo() {
    const { t } = useTranslation();

    return (
        <>
            <Typography component="p" sx={{ mb: 3 }}>
                {/* eslint-disable-next-line react/jsx-key */}
                <Trans
                    i18nKey="recurring_donation_paragraph"
                    values={{}}
                    components={[<strong></strong>, <Link target="_blank"></Link>]}
                />
            </Typography>
            <Typography component="ul">
                {RECURRING_FIELDS.map((key) => (
                    <Typography key={key} component="li">
                        <strong>{t(`recurring_donation_${key}`)} </strong>:{" "}
                        {t(`recurring_donation_${key}_description`)}
                    </Typography>
                ))}
            </Typography>
            <Typography component="p" sx={{ mt: 3 }}>
                {t("recurring_donation_confirmation_paragraph")}
            </Typography>
        </>
    );
}
