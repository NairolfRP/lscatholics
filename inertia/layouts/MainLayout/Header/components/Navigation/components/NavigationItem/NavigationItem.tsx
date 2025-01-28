import DropDownMenu from "@/components/common/DropDownMenu/DropDownMenu";
import Link from "@/components/common/Link/Link";
import { HeaderNavItem } from "@/features/navigation/types/navigation";
import { useEventCallback } from "@/hooks/use_event_callback";
import { useTranslation } from "@/hooks/use_translation";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import { useState } from "react";

interface NavigationItemProps {
    id: number;
    menu: HeaderNavItem;
}

export default function NavigationItem({ id, menu }: NavigationItemProps) {
    const { t } = useTranslation();

    const [submenu, setSubmenu] = useState<{ one: number | null; second: number | null }>({
        one: null,
        second: null,
    });

    const handleMouseEnter = useEventCallback((index: number) => {
        if (submenu.one === index) return;

        setSubmenu({ one: index, second: null });
    });

    const handleCloseMenu = useEventCallback(() => {
        setSubmenu({ one: null, second: null });
    });

    const handleMouseEnterSecondSubmenu = useEventCallback((index: number | null = null) => {
        if (submenu.second === index) return;

        setSubmenu({ ...submenu, second: index });
    });

    const handleCloseSecondSubmenu = useEventCallback(() => {
        setSubmenu({ ...submenu, second: null });
    });

    return (
        <Box
            component="li"
            id={`header-menu-item-${id}`}
            onMouseOver={() => handleMouseEnter(id)}
            onMouseLeave={handleCloseMenu}
            sx={{
                position: "relative",
                padding: 0,
            }}
        >
            <Button
                component={Link}
                color="inherit"
                href={menu.link ? menu.link : "#"}
                disableRipple
                endIcon={menu.items ? <KeyboardArrowDownIcon /> : null}
                sx={(theme) => ({
                    [theme.breakpoints.down(1328)]: {
                        fontSize: "0.75em",
                    },
                    [theme.breakpoints.down(1258)]: {
                        fontSize: "0.72em",
                    },
                })}
            >
                {t(menu.name)}
            </Button>
            {menu.items ? (
                <DropDownMenu open={submenu.one === id}>
                    {menu.items.map((subMenuItem, subIndex) => (
                        <ListItem
                            key={subIndex}
                            onMouseOver={() => handleMouseEnterSecondSubmenu(subIndex)}
                            onMouseLeave={handleCloseSecondSubmenu}
                        >
                            <ListItemButton
                                component={Link}
                                href={subMenuItem.link}
                                disableRipple
                                sx={{ position: "relative" }}
                            >
                                {t(subMenuItem.name)}{" "}
                                {subMenuItem.items ? (
                                    <KeyboardArrowRightIcon
                                        sx={{ position: "absolute", left: "90%" }}
                                    />
                                ) : null}
                            </ListItemButton>
                            {subMenuItem.items ? (
                                <DropDownMenu
                                    open={submenu.one === id && submenu.second === subIndex}
                                    position="right"
                                >
                                    {subMenuItem.items.map(
                                        (secondSubmenuItem, secondSubmenuIndex) => (
                                            <ListItem key={secondSubmenuIndex}>
                                                <ListItemButton
                                                    component={Link}
                                                    href={secondSubmenuItem.link}
                                                    disableRipple
                                                >
                                                    {t(secondSubmenuItem.name)}
                                                </ListItemButton>
                                            </ListItem>
                                        ),
                                    )}
                                </DropDownMenu>
                            ) : null}
                        </ListItem>
                    ))}
                </DropDownMenu>
            ) : null}
        </Box>
    );
}
