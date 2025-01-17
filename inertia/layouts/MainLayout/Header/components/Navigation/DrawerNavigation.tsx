import { useEventCallback } from "@/hooks/useEventCallback";
import { useTranslation } from "@/hooks/useTranslation";
import { menuItems } from "@/layouts/MainLayout/Header/components/Navigation/config/menuItems";
import { Link } from "@inertiajs/react";
import MenuIcon from "@mui/icons-material/Menu";
import { Divider, Drawer, ListItemButton, ListItemText } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useState } from "react";

export default function DrawerNavigation() {
    const { t } = useTranslation();

    const [open, setOpen] = useState(false);

    const handleClick = useEventCallback(() => setOpen((prev) => !prev));
    const handleClose = useEventCallback(() => setOpen(false));

    return (
        <>
            <IconButton
                onClick={handleClick}
                size="large"
                color="inherit"
                aria-label="menu"
                edge="end"
                sx={(theme) => ({
                    [theme.breakpoints.up(1246)]: { display: "none" },
                    mr: 2,
                    ml: 2,
                })}
            >
                <MenuIcon />
            </IconButton>
            <Drawer
                open={open}
                onClose={handleClose}
                PaperProps={{
                    sx: {
                        backgroundColor: "primary.main",
                        color: "primary.contrastText",
                        overflow: "auto",
                    },
                }}
            >
                <List>
                    {menuItems.map((menu, index) => {
                        return (
                            <React.Fragment key={index}>
                                {!menu.items ? (
                                    <ListItem disablePadding>
                                        <ListItemButton
                                            component={Link}
                                            href={menu.link ? menu.link : "#"}
                                        >
                                            <ListItemText primary={t(menu.name)} />
                                        </ListItemButton>
                                    </ListItem>
                                ) : (
                                    <>
                                        <ListItem>
                                            <Typography variant="h5">{t(menu.name)}</Typography>
                                            <Divider />
                                        </ListItem>
                                    </>
                                )}
                                {menu.items &&
                                    menu.items.map((subMenuItem, subIndex) => (
                                        <ListItem disablePadding key={subIndex}>
                                            <ListItemButton
                                                component={Link}
                                                href={subMenuItem.link ? subMenuItem.link : "#"}
                                            >
                                                <ListItemText primary={t(subMenuItem.name)} />
                                            </ListItemButton>
                                        </ListItem>
                                    ))}
                            </React.Fragment>
                        );
                    })}
                </List>
            </Drawer>
        </>
    );
}
