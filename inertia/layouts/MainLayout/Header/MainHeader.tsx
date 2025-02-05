import AccountButtonIcon from "@/components/auth/AccountButtonIcon/AccountButtonicon";
import LoginServicesButtonsWithModal from "@/features/auth/components/LoginServicesButtonWithModal/LoginServicesButtonWithModal";
import AppLogo from "@/layouts/MainLayout/Header/components/AppLogo/AppLogo";
import DonateButton from "@/layouts/MainLayout/Header/components/Navigation/components/DonateButton/DonateButton";
import { menuItems } from "@/layouts/MainLayout/Header/components/Navigation/config/menu_items";
import DrawerNavigation from "@/layouts/MainLayout/Header/components/Navigation/DrawerNavigation";
import Navigation from "@/layouts/MainLayout/Header/components/Navigation/Navigation";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import { type Theme, useColorScheme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { usePage } from "@inertiajs/react";
import type { SharedProps } from "@adonisjs/inertia/types";
import useScrollTrigger from "@mui/material/useScrollTrigger";
import * as React from "react";
import IconButton from "@mui/material/IconButton";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";

const mainHeaderULStyle = (theme: Theme) => ({
    "display": "flex",
    "alignItems": "flex-end",
    "listStyle": "none",
    "padding": 0,
    "margin": 0,
    "& > li > a": {
        fontWeight: 900,
    },
    "& > li": {
        marginLeft: 3,
    },
    "& :first-of-type": {
        marginLeft: 0,
    },
    [theme.breakpoints.down(1246)]: {
        display: "none",
    },
});

function PositionScroll(props: { children: React.ReactElement<{ position: string }> }) {
    const trigger = useScrollTrigger({
        disableHysteresis: true,
        threshold: 0,
    });

    return props.children
        ? React.cloneElement(props.children, {
              position: trigger ? "fixed" : "sticky",
          })
        : null;
}

export default function MainHeader() {
    const { auth } = usePage<SharedProps>().props;
    const { mode, setMode } = useColorScheme();

    return (
        <PositionScroll>
            <AppBar id="app-header" sx={{ height: 100 }}>
                <Toolbar component="nav" id="header-navigation">
                    <AppLogo />
                    <Box component="ul" id="header-menu" sx={mainHeaderULStyle}>
                        <Navigation menus={menuItems} />

                        <DonateButton />
                    </Box>
                    <Box id="header-account-button">
                        {auth.user ? <AccountButtonIcon /> : <LoginServicesButtonsWithModal />}
                    </Box>
                    <IconButton
                        onClick={() => setMode(mode === "light" ? "dark" : "light")}
                        color="inherit"
                    >
                        {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                    </IconButton>
                    <DrawerNavigation />
                </Toolbar>
            </AppBar>
        </PositionScroll>
    );
}
