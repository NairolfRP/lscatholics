import MainLayout from "@/layouts/MainLayout/MainLayout";
import { Head } from "@inertiajs/react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";

export default function ErrorPage({ error }: { error: number }) {
    const title = {
        503: "503: Service Unavailable",
        500: "500: Server Error",
        404: "404: Page Not Found",
        403: "403: Forbidden"
    }[error];

    const description = {
        503: "Sorry, we are doing some maintenance. Please check back soon.",
        500: "Whoops, something went wrong on our servers.",
        404: "Sorry, the page you are looking for could not be found.",
        403: "Sorry, you are forbidden from accessing this page."
    }[error];

    return (
        <MainLayout bannerTitle={title}>
            <Head title={title} />
            <Container sx={{ mt: 5, mb: 15 }}>
                <Typography variant="h2">{title}</Typography>
                <Typography>{description}</Typography>
            </Container>
        </MainLayout>
    );
}
