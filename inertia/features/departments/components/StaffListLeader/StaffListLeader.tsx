import { IStaffListLeader } from "@/features/departments/types/staffList";
import { useTranslation } from "@/hooks/useTranslation";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Paper from "@mui/material/Paper";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";

const GridItem = styled(Paper)(({ theme }) => ({
    ...theme.typography.body1,
    padding: theme.spacing(2)
}));

export default function StaffListLeader({ name, position, image }: IStaffListLeader) {
    const { t } = useTranslation();
    return (
        <Container sx={{ marginBottom: "5rem" }}>
            <Grid container sx={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
                <Grid size={{ xs: 5 }}>
                    <GridItem elevation={0}>
                        <Box
                            component="img"
                            src={image ? image : "https://lacatholics.org/wp-content/uploads/2018/11/shutterstock_324535487-scaled.jpg"}
                            alt=""
                            sx={{ width: "auto", height: "auto", maxWidth: "100%" }}
                        />
                    </GridItem>
                </Grid>
                <Grid size={{ xs: 7 }}>
                    <GridItem elevation={0}>
                        <Typography variant="h2">{name}</Typography>
                        <Typography component="h3" variant="h4" fontWeight={800} sx={{ color: "#e3550a" }}>
                            {t(position)}
                        </Typography>
                    </GridItem>
                </Grid>
            </Grid>
        </Container>
    );
}
