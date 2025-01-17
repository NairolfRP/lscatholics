import { SingleApplicationProps } from "@/features/applications/types/applications";
import MainLayout from "@/layouts/MainLayout/MainLayout";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function SingleApplication({ application, applicant }: SingleApplicationProps) {
    return (
        <MainLayout hideBanner>
            <Container sx={{ mt: 15, mb: 35 }}>
                <Typography component="h1" variant="h2">
                    Par {application.character_name} (({applicant?.name || "Utilisateur supprimé"}))
                </Typography>
                <Typography>Statut : {application.status}</Typography>

                <Typography component="h3" variant="h4">
                    Champs spécifiques :
                </Typography>
                {Object.keys(application.fields).map((fieldKey) => {
                    const field = application.fields[fieldKey];
                    return (
                        <Typography key={fieldKey}>
                            {fieldKey} :{field.type === "date" && (typeof field.value === "string" || field.value instanceof Date) ? new Date(field.value).toLocaleDateString() : String(field.value)}
                        </Typography>
                    );
                })}
            </Container>
        </MainLayout>
    );
}
