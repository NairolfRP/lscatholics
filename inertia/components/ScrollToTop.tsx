import { useCallback } from "react";
import Zoom from "@mui/material/Zoom";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import useScrollTrigger from "@mui/material/useScrollTrigger";

export default function ScrollToTop() {
    const visible = useScrollTrigger({
        target: window || undefined,
        disableHysteresis: true,
        threshold: 300,
    });

    const handleClick = useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <Zoom in={visible}>
            <Fab
                color="primary"
                size="medium"
                onClick={handleClick}
                sx={{ position: "fixed", bottom: 20, right: 20, zIndex: 1000 }}
            >
                <KeyboardArrowUpIcon />
            </Fab>
        </Zoom>
    );
}
