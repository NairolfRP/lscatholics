import { useEventCallback } from "@/hooks/use_event_callback";
import { useCallback, useState } from "react";
import Zoom from "@mui/material/Zoom";
import Fab from "@mui/material/Fab";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useEventListener } from "@/hooks/use_event_listener";

export default function ScrollToTop() {
    const [visible, setVisible] = useState(false);

    const onScroll = useEventCallback(() => {
        setVisible(window.scrollY > 300);
    });

    const handleClick = useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    useEventListener("scroll", onScroll);

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
