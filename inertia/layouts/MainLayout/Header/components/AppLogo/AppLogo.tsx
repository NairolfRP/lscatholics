import LogoImg from "@/assets/images/logo.png";
import Link from "@/components/common/Link/Link";
import Box from "@mui/material/Box";

export default function AppLogo() {
    return (
        <Box
            component="div"
            id="app-header-logo"
            sx={{ flexGrow: 1, display: "block", maxHeight: "100%" }}
        >
            <Link href="/" title="Homepage">
                <img alt="Archdiocese of Los Santos logo" src={LogoImg} height="95" />
            </Link>
        </Box>
    );
}
