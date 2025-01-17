import { useEventCallback } from "@/hooks/useEventCallback";
import { useTranslation } from "@/hooks/useTranslation";
import { router, usePage } from "@inertiajs/react";
import LogoutIcon from "@mui/icons-material/Logout";
import Settings from "@mui/icons-material/Settings";
import TopicIcon from "@mui/icons-material/Topic";
import Avatar from "@mui/material/Avatar";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import { SharedProps } from "@adonisjs/inertia/types";

export default function AccountButtonIcon() {
    const { t } = useTranslation();
    const { auth } = usePage<SharedProps>().props;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const openMenu = Boolean(anchorEl);

    const handleMenuClick = useEventCallback((event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    });

    const handleMenuAction = useEventCallback(
        (_: React.MouseEvent<HTMLLIElement>, value: string) => {
            switch (value) {
                case "applications":
                    router.visit("/applications");
                    break;
                case "settings":
                    router.visit("/profile");
                    break;
                case "logout":
                    router.post("/api/auth/logout");
                    break;
            }

            handleMenuClose();
        },
    );

    const handleMenuClose = useEventCallback(() => {
        setAnchorEl(null);
    });

    return (
        <>
            <IconButton
                onClick={handleMenuClick}
                size="large"
                aria-label="account of current user"
                aria-controls={openMenu ? "account-menu" : "app-header"}
                aria-haspopup="true"
                aria-expanded={openMenu ? "true" : undefined}
                color="inherit"
                sx={{ ml: 5 }}
            >
                <Tooltip title={auth.user?.name}>
                    <Avatar src={auth.user?.avatarURL ?? undefined}>
                        {auth.user?.name?.substring(0, 1)}
                    </Avatar>
                </Tooltip>
            </IconButton>
            <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={openMenu}
                onClose={handleMenuClose}
                onClick={handleMenuClose}
                slotProps={{
                    paper: {
                        elevation: 0,
                        sx: {
                            "overflow": "visible",
                            "filter": "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                            "mt": 1.5,
                            "& .MuiAvatar-root": {
                                width: 32,
                                height: 32,
                                ml: -0.5,
                                mr: 1,
                            },
                            "&::before": {
                                content: '""',
                                display: "block",
                                position: "absolute",
                                top: 0,
                                right: 14,
                                width: 10,
                                height: 10,
                                bgcolor: "background.paper",
                                transform: "translateY(-50%) rotate(45deg)",
                                zIndex: 0,
                            },
                        },
                    },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            >
                <MenuItem onClick={(e) => handleMenuAction(e, "applications")}>
                    <ListItemIcon>
                        <TopicIcon fontSize="small" />
                    </ListItemIcon>
                    {t("applications")}
                </MenuItem>
                <Divider />
                <MenuItem onClick={(e) => handleMenuAction(e, "settings")}>
                    <ListItemIcon>
                        <Settings fontSize="small" />
                    </ListItemIcon>
                    {t("settings")}
                </MenuItem>
                <MenuItem onClick={(e) => handleMenuAction(e, "logout")}>
                    <ListItemIcon>
                        <LogoutIcon fontSize="small" />
                    </ListItemIcon>
                    {t("logout")}
                </MenuItem>
            </Menu>
        </>
    );
}
