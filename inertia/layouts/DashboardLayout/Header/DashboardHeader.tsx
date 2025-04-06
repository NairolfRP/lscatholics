import Container from "@mui/material/Container";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import { useTranslation } from "@/hooks/use_translation";
import LogoImg from "@/assets/images/logo.png";
import Box from "@mui/material/Box";
import AccountButtonIcon from "@/components/auth/AccountButtonIcon/AccountButtonicon";
import { MiniDrawerAppBar } from "@/components/MiniDrawer";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import { type Dispatch, type SetStateAction } from "react";
import { useEventCallback } from "@/hooks/use_event_callback";
import SwitchThemeModeButton from "@/components/SwitchThemeModeButton";

export default function DashboardHeader({
    openSideBar,
    setOpenSideBar,
}: {
    openSideBar: boolean;
    setOpenSideBar: Dispatch<SetStateAction<boolean>>;
}) {
    const { t } = useTranslation();

    const handleDrawerOpen = useEventCallback(() => {
        setOpenSideBar(true);
    });

    return (
        <MiniDrawerAppBar position="fixed" open={openSideBar}>
            <Container maxWidth="xl">
                <Toolbar>
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        onClick={handleDrawerOpen}
                        edge="start"
                        sx={[
                            {
                                marginRight: 5,
                            },
                            openSideBar && { display: "none" },
                        ]}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box
                        component="img"
                        src={LogoImg}
                        sx={{ width: "4vw", display: { xs: "none", md: "flex" }, mr: 1 }}
                    />
                    <Typography
                        variant="h6"
                        noWrap
                        sx={{
                            mr: 2,
                            display: { xs: "none", md: "flex" },
                            fontWeight: 700,
                            letterSpacing: ".3rem",
                            color: "inherit",
                            textDecoration: "none",
                        }}
                    >
                        {t("archdiocese_of_los_santos")}
                    </Typography>

                    <Box sx={{ position: "absolute", right: 0 }}>
                        <AccountButtonIcon />
                        <SwitchThemeModeButton />
                    </Box>
                </Toolbar>
            </Container>
        </MiniDrawerAppBar>
    );
}
