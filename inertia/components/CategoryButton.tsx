import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import Button, { ButtonProps } from "@mui/material/Button";
import type { ReactNode } from "react";

export default function CategoryButton({ children, onClick, color, selected = true }: { onClick?: ButtonProps["onClick"]; color: string | "inherit"; selected?: boolean; children: ReactNode }) {
    const isInheritColor = color === "inherit";

    return (
        <Button
            variant="contained"
            startIcon={selected ? <CloseIcon /> : <AddIcon />}
            sx={{ "fontWeight": "800", "background": isInheritColor ? null : color, "&:hover": { backgroundColor: isInheritColor ? "primary.main" : color } }}
            onClick={onClick}
            disableFocusRipple
            disableRipple
            disableTouchRipple
        >
            {children}
        </Button>
    );
}
