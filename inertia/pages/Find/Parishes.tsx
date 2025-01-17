import { parishesList } from "@/features/parishes/constants/parishes";
import { useTranslation } from "@/hooks/useTranslation";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import { Head } from "@inertiajs/react";
import { CardActionArea, CardMedia } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid2";
import Typography from "@mui/material/Typography";
import type { MouseEventHandler } from "react";

function ParishGridItem({ name, image, address, onAction }: { name: string; image: string; address: string; onAction?: MouseEventHandler<HTMLButtonElement> }) {
    return (
        <Grid>
            <Card sx={{ maxWidth: "100%", height: "100%" }} elevation={1}>
                <CardActionArea onClick={onAction}>
                    <CardMedia component="img" height="250" image={image} alt={name} />
                    <CardContent>
                        <Typography component="h3" variant="h4">
                            {name}
                        </Typography>
                        <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            {address}
                        </Typography>
                    </CardContent>
                </CardActionArea>
            </Card>
        </Grid>
    );
}

export default function Parishes() {
    const { t } = useTranslation();
    return (
        <MainLayout bannerTitle={t("find_parish")}>
            <Head title={t("find_parish")} />
            <Container sx={{ mt: 10, mb: 15 }}>
                <Grid container spacing={2}>
                    {parishesList.map((parish, parishIndex) => (
                        <ParishGridItem key={parishIndex} name={t(parish.name)} image={parish.image} address={parish.address} />
                    ))}
                </Grid>
            </Container>
        </MainLayout>
    );
}
