import { Link as InertiaLink } from "@inertiajs/react";
import { Link as MuiLink, LinkProps as MuiLinkProps } from "@mui/material";
import React from "react";

type InertiaLinkProps = MuiLinkProps & {
    href: string;
};

const isExternalLink = (href: string) => {
    if (!href.startsWith("http") && !href.startsWith("www")) return false;

    try {
        const link = new URL(href, window.location.href);

        return link.hostname !== window.location.hostname;
    } catch (e) {
        return true;
    }
};

const Link = React.forwardRef(
    ({ href, children, ...props }: React.PropsWithChildren<InertiaLinkProps>, ref) => {
        const isExternal = isExternalLink(href);

        return (
            <MuiLink component={isExternal ? "a" : InertiaLink} href={href} ref={ref} {...props}>
                {children}
            </MuiLink>
        );
    },
);

Link.displayName = "Link";

export default Link;
