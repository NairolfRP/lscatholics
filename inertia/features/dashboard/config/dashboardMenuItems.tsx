import DashboardIcon from "@mui/icons-material/Dashboard";
import { type ReactNode } from "react";

interface DashboardMenuItem {
    key: string;
    link: string;
    icon: ReactNode;
}

export const dashboardMenuItems: DashboardMenuItem[] = [
    {
        key: "dashboard",
        link: "/dashboard",
        icon: <DashboardIcon />,
    },
];
