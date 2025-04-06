import { MiniDrawer, MiniDrawerHeader } from "@/components/MiniDrawer";
import type { Dispatch, SetStateAction } from "react";
import IconButton from "@mui/material/IconButton";
import { useEventCallback } from "@/hooks/use_event_callback";
import { useTheme } from "@mui/material/styles";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ListItemButton from "@mui/material/ListItemButton";
import ListItem from "@mui/material/ListItem";
import { dashboardMenuItems } from "@/features/dashboard/config/dashboardMenuItems";
import { useTranslation } from "@/hooks/use_translation";
import Link from "@/components/common/Link/Link";

export default function DashboardSidebar({
    open,
    setOpen,
}: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
}) {
    const { t } = useTranslation();
    const theme = useTheme();
    const handleClose = useEventCallback(() => {
        setOpen(false);
    });

    return (
        <MiniDrawer variant="permanent" open={open}>
            <MiniDrawerHeader>
                <IconButton onClick={handleClose}>
                    {theme.direction === "rtl" ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </MiniDrawerHeader>
            <Divider />
            <List>
                {dashboardMenuItems.map((item) => (
                    <ListItem key={item.key} disablePadding sx={{ display: "block" }}>
                        <ListItemButton
                            component={Link}
                            href={item.link}
                            sx={[
                                {
                                    minHeight: 48,
                                    px: 2.5,
                                },
                                open
                                    ? {
                                          justifyContent: "initial",
                                      }
                                    : {
                                          justifyContent: "center",
                                      },
                            ]}
                        >
                            <ListItemIcon
                                sx={[
                                    {
                                        minWidth: 0,
                                        justifyContent: "center",
                                    },
                                    open
                                        ? {
                                              mr: 3,
                                          }
                                        : {
                                              mr: "auto",
                                          },
                                ]}
                            >
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={t(item.key)}
                                sx={[
                                    open
                                        ? {
                                              opacity: 1,
                                          }
                                        : {
                                              opacity: 0,
                                          },
                                ]}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </MiniDrawer>
    );
}
