import { Link as InertiaLink } from "@inertiajs/react";
import { Link as MuiLink, LinkProps as MuiLinkProps } from "@mui/material";
import React from "react";

type InertiaLinkProps = MuiLinkProps & {
    href: string;
};

const Link = React.forwardRef(
    ({ href, children, ...props }: React.PropsWithChildren<InertiaLinkProps>, ref) => {
        return (
            <MuiLink component={InertiaLink} href={href} ref={ref} {...props}>
                {children}
            </MuiLink>
        );
    },
);

Link.displayName = "Link";

export default Link;
