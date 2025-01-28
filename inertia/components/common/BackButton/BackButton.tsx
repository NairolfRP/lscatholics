import { useEventCallback } from "@/hooks/use_event_callback";
import { router } from "@inertiajs/react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import Button, { ButtonProps } from "@mui/material/Button";

/**
 * Back button. Can be configured for a route or to return to the last client page.
 * @param children
 * @param color
 * @param variant
 * @param to If empty, the button returns to the client's last page
 * @param sx
 * @param icon
 */
export default function BackButton({
    children,
    color = "primary",
    variant = "contained",
    to,
    sx,
    icon,
}: {
    children: React.ReactNode;
    color?: ButtonProps["color"];
    variant?: ButtonProps["variant"];
    to?: string | { name: string; params?: Record<string, string> };
    sx?: ButtonProps["sx"];
    icon?: ButtonProps["startIcon"];
}) {
    const handleClick = useEventCallback(() => {
        if (to) {
            if (typeof to === "string") {
                return router.visit(to);
            }

            return router.visit(to.name);
        }

        return history.back();
    });

    return (
        <Button
            startIcon={icon || <ArrowBackIcon />}
            color={color}
            variant={variant}
            onClick={handleClick}
            sx={sx}
        >
            {children}
        </Button>
    );
}
