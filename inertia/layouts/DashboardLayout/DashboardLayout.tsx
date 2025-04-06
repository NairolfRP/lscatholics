import { PropsWithChildren, useState } from "react";
import DashboardHeader from "@/layouts/DashboardLayout/Header/DashboardHeader";
import Notifications from "@/components/Notifications";
import DashboardSidebar from "@/layouts/DashboardLayout/Sidebar/DashboardSidebar";
import ScrollToTop from "@/components/ScrollToTop";
import Box from "@mui/material/Box";
import { MiniDrawerHeader } from "@/components/MiniDrawer";
import DevelopmentBanner from "@/components/DevelopmentBanner";

export default function DashboardLayout({ children }: PropsWithChildren<{}>) {
    const [openSideBar, setOpenSideBar] = useState(true);

    return (
        <Box sx={{ display: "flex" }}>
            <Notifications />
            <DashboardHeader openSideBar={openSideBar} setOpenSideBar={setOpenSideBar} />
            <DashboardSidebar open={openSideBar} setOpen={setOpenSideBar} />
            <Box component="main" id="dashboard-content" sx={{ flexGrow: 1, p: 3, my: 3 }}>
                <MiniDrawerHeader />
                {children}
            </Box>
            <DevelopmentBanner />
            <ScrollToTop />
        </Box>
    );
}
