import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { CSSProperties } from "react";

export interface MainPageBannerProps {
    title?: string;
    image?: string;
    bgcolor?: CSSProperties["backgroundColor"];
}
export default function MainPageBanner({ title, image, bgcolor = "black" }: MainPageBannerProps) {
    return (
        <Box
            component="section"
            id="app-page-banner"
            bgcolor={bgcolor}
            color="primary.contrastText"
            flexWrap="wrap"
            alignItems="flex-end"
            sx={{
                display: "flex",
                height: "85vh",
                position: "relative",
                color: "#FFF",
            }}
        >
            {title ? (
                <Container maxWidth="md" sx={{ zIndex: 3 }}>
                    <Typography
                        component="h1"
                        variant="h1"
                        sx={{
                            fontWeight: 400,
                            pb: { xs: "15rem", md: "10rem" },
                            mr: "-1rem",
                            ml: { xs: "1rem", md: "-1rem" },
                            textShadow: "0 2px 4px rgba(0,0,0,.5)",
                            typography: {
                                xs: {
                                    fontSize: "2.5rem",
                                },
                                sm: {
                                    fontSize: "3rem",
                                },
                                md: {
                                    fontSize: "5rem",
                                },
                            },
                        }}
                    >
                        {title}
                    </Typography>

                    {/*<Breadcrumbs aria-label="breadcrumb" sx={{ pb: '2%', fontWeight: 500 }} color="inherit" separator="›">
                <Link color="inherit" underline="hover" href="/">
                    MUI
                </Link>
                <Link
                    underline="hover"
                    color="inherit"
                    href="/material-ui/getting-started/installation/"
                >
                    Core
                </Link>
                <Typography color="inherit">Breadcrumbs</Typography>
            </Breadcrumbs>*/}
                </Container>
            ) : null}

            <Box
                component="img"
                src={image}
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    objectPosition: "75% 50%",
                    opacity: 0.65,
                }}
            />
        </Box>
    );
}
