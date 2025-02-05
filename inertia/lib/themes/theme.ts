import { createTheme, responsiveFontSizes } from "@mui/material/styles";
import type { CSSProperties } from "react";

declare module "@mui/material/styles" {
    interface BreakpointOverrides {
        xs: true;
        sm: true;
        md: true;
        lg: true;
        xl: true;
        mobile: true;
        tablet: true;
        laptop: true;
        desktop: true;
    }
}

const globalHeadingStyles: CSSProperties = {
    fontFamily: "'Pathway Gothic One', sans-serif",
    textTransform: "uppercase",
};

const createdTheme = createTheme({
    colorSchemes: {
        light: {
            palette: {
                primary: {
                    main: "#328fcc",
                    contrastText: "#FFF",
                },
                secondary: {
                    main: "#db9b24",
                    contrastText: "#FFF",
                },
            },
        },
        dark: {
            palette: {
                primary: {
                    main: "#1b72ab",
                    contrastText: "#FFF",
                },
                secondary: {
                    main: "#c08008",
                    contrastText: "#FFF",
                },
                background: {
                    default: "#1f1f1f",
                    paper: "#1f1f1f",
                },
            },
        },
    },

    // Breakpoints
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
            mobile: 0,
            tablet: 640,
            laptop: 1024,
            desktop: 1200,
        },
    },

    // Typography
    typography: {
        fontFamily: "'Nunito', sans-serif",
        fontWeightRegular: 500,
        h1: {
            ...globalHeadingStyles,
            fontWeight: 300,
            fontSize: "7.5rem",
        },
        h2: {
            ...globalHeadingStyles,
            fontWeight: 400,
        },
        h3: {
            ...globalHeadingStyles,
            fontWeight: 900,
        },
        h4: {
            ...globalHeadingStyles,
        },
        h5: {
            ...globalHeadingStyles,
        },
        h6: {
            ...globalHeadingStyles,
        },
    },

    // Components
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                "#app": {
                    display: "flex",
                    flexDirection: "column",
                    minHeight: "100vh",
                    overflow: "hidden",
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                    padding: ".75rem 1.25rem",
                },
            },
            defaultProps: {
                disableElevation: true,
                disableRipple: true,
                disableFocusRipple: true,
                disableTouchRipple: true,
            },
        },
        MuiAppBar: {
            defaultProps: {
                variant: "outlined",
                elevation: 0,
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 0,
                },
            },
            defaultProps: {
                elevation: 0,
            },
        },
    },
});

export const theme = responsiveFontSizes(createdTheme);
