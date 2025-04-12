import Notifications from "@/components/Notifications";
import MainFooter from "@/layouts/MainLayout/Footer/MainFooter";
import MainHeader from "@/layouts/MainLayout/Header/MainHeader";
import MainPageBanner, {
    MainPageBannerProps,
} from "@/layouts/MainLayout/PageBanner/MainPageBanner";
import Box from "@mui/material/Box";
import * as React from "react";
import ScrollToTop from "@/components/ScrollToTop";
import DevelopmentBanner from "@/components/DevelopmentBanner";
import Head from "@/components/AppHead";

interface MainLayoutProps {
    bannerImg?: MainPageBannerProps["image"];
    bannerColor?: MainPageBannerProps["bgcolor"];
    bannerTitle?: MainPageBannerProps["title"];
    hideBanner?: boolean;
}

export default function MainLayout({
    children,
    bannerTitle,
    bannerImg,
    bannerColor,
    hideBanner = false,
}: React.PropsWithChildren<MainLayoutProps>) {
    return (
        <React.Fragment>
            <Head />
            <Notifications />
            <MainHeader />
            {!hideBanner ? (
                <MainPageBanner title={bannerTitle} image={bannerImg} bgcolor={bannerColor} />
            ) : null}
            <Box id="app-content" sx={{ margin: 0 }}>
                {children}
            </Box>
            <MainFooter />
            <DevelopmentBanner />
            <ScrollToTop />
        </React.Fragment>
    );
}
