import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import IconButton from "@mui/material/IconButton";
import { useColorScheme } from "@mui/material/styles";

export default function SwitchThemeModeButton() {
    const { mode, setMode } = useColorScheme();

    return (
        <IconButton onClick={() => setMode(mode === "light" ? "dark" : "light")} color="inherit">
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
        </IconButton>
    );
}
