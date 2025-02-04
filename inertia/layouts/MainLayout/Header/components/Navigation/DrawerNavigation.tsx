import { useEventCallback } from "@/hooks/use_event_callback";
import { useTranslation } from "@/hooks/use_translation";
import { menuItems } from "@/layouts/MainLayout/Header/components/Navigation/config/menu_items";
import { Link } from "@inertiajs/react";
import MenuIcon from "@mui/icons-material/Menu";
import { Drawer, ListItemButton, ListItemText } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import { useState } from "react";
import Collapse from "@mui/material/Collapse";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import type { HeaderNavSubmenuItem } from "@/features/navigation/types/navigation";
import AppLogo from "@/layouts/MainLayout/Header/components/AppLogo/AppLogo";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";

function ListItemButtonWithCollapse({
    label,
    items,
}: {
    label: string;
    items: HeaderNavSubmenuItem[];
}) {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);

    const toggleOpen = useEventCallback(() => setOpen((prev) => !prev));

    return (
        <>
            <ListItemButton onClick={toggleOpen} sx={{ maxWidth: "85%" }}>
                <ListItemText primary={t(label)} />
                {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit sx={{ bgcolor: "#035d96" }}>
                <List component="div" disablePadding>
                    {items.map((item, itemKey) => (
                        <>
                            <ListItemButton
                                key={itemKey}
                                component={Link}
                                sx={{ pl: 4 }}
                                href={item.link || "#"}
                            >
                                <ListItemText primary={t(item.name)} />
                            </ListItemButton>
                            {item.items &&
                                item.items.map((subItem, subItemKey) => (
                                    <ListItemButton
                                        key={subItemKey}
                                        component={Link}
                                        sx={{ pl: 8 }}
                                        href={subItem.link ? subItem.link : "#"}
                                    >
                                        <ListItemText primary={t(subItem.name)} />
                                    </ListItemButton>
                                ))}
                        </>
                    ))}
                </List>
            </Collapse>
        </>
    );
}

export default function DrawerNavigation() {
    const { t } = useTranslation();
    const [open, setOpen] = useState(false);
    const toggleDrawer = useEventCallback(() => setOpen((prev) => !prev));

    return (
        <>
            <IconButton
                onClick={toggleDrawer}
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
                onClose={toggleDrawer}
                PaperProps={{
                    sx: {
                        width: "100%",
                        backgroundColor: "primary.main",
                        color: "primary.contrastText",
                        overflow: "auto",
                    },
                }}
            >
                <List subheader={<AppLogo />}>
                    <Box
                        onClick={toggleDrawer}
                        sx={(theme) => ({
                            position: "fixed",
                            top: 20,
                            right: 20,
                            display: "flex",
                            alignItems: "center",
                            padding: theme.spacing(0, 1),
                            ...theme.mixins.toolbar,
                        })}
                    >
                        <CloseIcon fontSize="large" />
                    </Box>
                    {menuItems.map((menu, index) =>
                        !menu.items ? (
                            <ListItem key={index} disablePadding>
                                <ListItemButton component={Link} href={menu.link || "#"}>
                                    <ListItemText primary={t(menu.name)} />
                                </ListItemButton>
                            </ListItem>
                        ) : (
                            <ListItemButtonWithCollapse
                                key={index}
                                label={menu.name}
                                items={menu.items}
                            />
                        ),
                    )}
                </List>
            </Drawer>
        </>
    );
}
