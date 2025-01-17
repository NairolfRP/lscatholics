import AccountButtonIcon from "@/components/auth/AccountButtonIcon/AccountButtonicon";
import LoginServicesButtonsWithModal from "@/features/auth/components/LoginServicesButtonWithModal/LoginServicesButtonWithModal";
import AppLogo from "@/layouts/MainLayout/Header/components/AppLogo/AppLogo";
import DonateButton from "@/layouts/MainLayout/Header/components/Navigation/components/DonateButton/DonateButton";
import { menuItems } from "@/layouts/MainLayout/Header/components/Navigation/config/menuItems";
import DrawerNavigation from "@/layouts/MainLayout/Header/components/Navigation/DrawerNavigation";
import Navigation from "@/layouts/MainLayout/Header/components/Navigation/Navigation";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import type { Theme } from "@mui/material/styles";
import Toolbar from "@mui/material/Toolbar";
import { usePage } from "@inertiajs/react";

import type { SharedProps } from "@adonisjs/inertia/types";

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

export default function MainHeader() {
    const { auth } = usePage<SharedProps>().props;

    return (
        <AppBar position="fixed" id="app-header" sx={{ height: 100 }}>
            <Toolbar component="nav" id="header-navigation">
                <AppLogo />

                <Box component="ul" id="header-menu" sx={mainHeaderULStyle}>
                    <Navigation menus={menuItems} />

                    <DonateButton />
                </Box>

                <Box id="header-account-button">
                    {auth.user ? <AccountButtonIcon /> : <LoginServicesButtonsWithModal />}
                </Box>

                <DrawerNavigation />
            </Toolbar>
        </AppBar>
    );
}
