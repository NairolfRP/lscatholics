import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Fade from "@mui/material/Fade";
import { useTheme } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import React from "react";

interface LoadingScreenProps {
    message?: string;
    delay?: number;
    transparent?: boolean;
}

export default function LoadingScreen({
    message = "Loading...",
    delay = 500,
    transparent = false,
}: LoadingScreenProps) {
    const theme = useTheme();
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => {
            setShow(true);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [delay]);

    if (!show) {
        return null;
    }

    return (
        <Fade in={show} timeout={300}>
            <Box
                sx={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: transparent
                        ? `${theme.palette.background.default}cc`
                        : theme.palette.background.default,
                    zIndex: theme.zIndex.modal + 1,
                    backdropFilter: transparent ? "blur(4px)" : "none",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        padding: 3,
                        borderRadius: 2,
                        backgroundColor: transparent
                            ? theme.palette.background.paper
                            : "transparent",
                    }}
                >
                    <CircularProgress
                        size={60}
                        thickness={4}
                        sx={{
                            color: theme.palette.primary.main,
                        }}
                    />
                    <Typography
                        variant="h6"
                        component="h2"
                        sx={{
                            color: theme.palette.text.secondary,
                            marginTop: 2,
                            textAlign: "center",
                        }}
                    >
                        {message}
                    </Typography>
                </Box>
            </Box>
        </Fade>
    );
}
