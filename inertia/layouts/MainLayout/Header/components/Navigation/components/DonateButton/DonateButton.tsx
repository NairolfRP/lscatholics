import Link from "@/components/common/Link/Link";
import VolunteerActivismIcon from "@mui/icons-material/VolunteerActivism";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import { useTranslation } from "@/hooks/useTranslation";

export default function DonateButton() {
    const { t } = useTranslation();

    return (
        <Box component="li" id="header-donate-button">
            <Button
                component={Link}
                color="secondary"
                variant="contained"
                href="/donate"
                startIcon={<VolunteerActivismIcon htmlColor="#8B0577" />}
                disableRipple
            >
                {t("donate")}
            </Button>
        </Box>
    );
}
