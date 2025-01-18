import Box, { BoxProps } from "@mui/material/Box";
import Container from "@mui/material/Container";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { useTranslation } from "@/hooks/useTranslation";

const StaffListTittleBackground = styled(Box)<BoxProps>(({ theme }) => ({
    backgroundColor: "#e3550a",
    color: "#FFF",
    paddingTop: theme.spacing(2),
    paddingBottom: theme.spacing(1),
    marginBottom: theme.spacing(4),
    borderBottom: "15px solid #BD4909FF",
}));

export default function StaffListTittle() {
    const { t } = useTranslation();

    return (
        <StaffListTittleBackground>
            <Container>
                <Typography variant="h2">{t("staff_list_title")}</Typography>
            </Container>
        </StaffListTittleBackground>
    );
}
