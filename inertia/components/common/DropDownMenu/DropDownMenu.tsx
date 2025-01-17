import { styled } from "@mui/material";
import List from "@mui/material/List";
import * as React from "react";

interface DropDownMenuProps extends React.ComponentPropsWithRef<typeof List> {
    open?: boolean;
    position?: "bottom" | "top" | "left" | "right";
}

const StyledList = styled(List)(({ theme }) => ({
    position: "absolute",
    width: "10rem",
    zIndex: 1,
    top: "100%",
    left: 0,
    backgroundColor: theme.palette.primary.main
}));

export default function DropDownMenu({ position, open = false, ...props }: DropDownMenuProps) {
    const { sx, children, ...others } = props;

    const stylesPosition = () => {
        switch (position) {
            case "right":
                return {
                    left: "100%",
                    top: 0
                };
            case "left":
                return {
                    left: "-100%",
                    top: 0
                };
            case "top":
                return {
                    left: 0,
                    top: "-100%"
                };
            default:
                return null;
        }
    };

    const styles = () => {
        let returnStyles = {};

        if (sx && typeof sx === "object" && "display" in sx) {
            returnStyles = { display: sx.display };
        } else {
            returnStyles = { display: open ? null : "none" };
        }

        const customPosition = stylesPosition();

        if (customPosition) {
            returnStyles = { ...returnStyles, ...customPosition };
        }

        return { ...returnStyles, ...sx };
    };

    return (
        <StyledList sx={styles} {...others}>
            {children}
        </StyledList>
    );
}
